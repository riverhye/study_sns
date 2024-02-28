package studysns.server.controller;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.multipart.MultipartFile;
import studysns.server.dto.UserDTO;
import studysns.server.entity.UserEntity;
import studysns.server.security.TokenProvider;
import studysns.server.service.UserService;
import studysns.server.socket.WebSocketHandler;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @Autowired
    TokenProvider tokenProvider;

    @Autowired
    private WebSocketHandler webSocketHandler;

    @GetMapping("/signup")
    public String getSignIn(){
        return "GET: user";
    }

    @PostMapping("/signup/check")
    public ResponseEntity<?> checkEmailAvailability(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean exists = userService.checkEmailExists(email);
        return ResponseEntity.ok().body(Collections.singletonMap("emailAvailable", !exists));
    }

    @PostMapping("/signup/process")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            String randomNickname = generateRandomNickname(); // 랜덤 닉네임 생성
            String theProfileImageUrl = "https://source.boringavatars.com/beam/120/" + randomNickname;

            UserEntity userEntity = UserEntity.builder()
                .email(userDTO.getEmail())
                .nickname(randomNickname)
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .profileImage(theProfileImageUrl)
                .loginType(userDTO.getLoginType())
                .build();

            UserEntity responseUser = userService.createUser(userEntity);
            responseUser = userService.updateUser(responseUser);

            UserDTO responseUserDTO = UserDTO.builder()
                .email(responseUser.getEmail())
                .nickname(responseUser.getNickname())
                .password(null)
                .loginType(responseUser.getLoginType())
                .profileImage(responseUser.getProfileImage())  // 변경된 프로필 이미지 URL을 DTO에도 저장
                .userId(responseUser.getUserId())
                .build();
            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String generateRandomNickname() {
        return "user_" + UUID.randomUUID().toString().substring(0, 8);
    }

    @PostMapping("/signin/process")
    public ResponseEntity<?> loginUser(@RequestBody UserDTO userDTO){
        try{
            UserEntity userEntity = userService.login(userDTO.getEmail(), userDTO.getPassword());
            if(userEntity == null){
                return ResponseEntity.badRequest().body("로그인 실패");
            }

            String token = tokenProvider.createToken(userEntity);

            UserDTO responseUserDTO = UserDTO.builder()
//                    .email(userEntity.getEmail())
                    .nickname(userEntity.getNickname())
//                    .password(userEntity.getPassword())
                    .userId(userEntity.getUserId())
                    .profileImage(userEntity.getProfileImage())
//                    .loginType(userEntity.getLoginType())
                    .token(token)
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value="Authorization") String token) {
        token = token.substring(7);
        userService.blacklistToken(token);
        return ResponseEntity.ok().body("로그아웃이 성공하였습니다.");
    }

    @GetMapping("/editprofile")
    public String getEditProfilePage(@AuthenticationPrincipal String userId) {
        return "GET /editprofile by user id "+ userId;
    }

    @PatchMapping("/editprofile/process")
    public ResponseEntity<?> editUserProfile(@AuthenticationPrincipal String userId, @RequestBody UserDTO userDTO, @RequestHeader(value="Authorization") String token) {
        try {
            token = token.substring(7);

            UserEntity existingUser = userService.findUserById(Long.valueOf(userId));
            if (existingUser == null) {
                return ResponseEntity.notFound().build();
            }

            existingUser.setNickname(userDTO.getNickname());
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }

            UserEntity updatedUser = userService.updateUser(existingUser);

            UserDTO responseUserDTO = UserDTO.builder()
                    .nickname(updatedUser.getNickname())
                    .password(null) // 응답에 비밀번호 포함을 피함
                    .profileImage(updatedUser.getProfileImage())
                    .userId(updatedUser.getUserId())
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/editprofile/image")
    public ResponseEntity<?> uploadImage(@RequestParam("profileImageFile") MultipartFile profileImageFile, @PathVariable("userId") Long userId) {
        try {
            // 프로필 이미지 파일 저장
            String profileImage = userService.saveProfileImage(profileImageFile);
            if (profileImage == null) {
                // 파일 저장 실패 시
                return ResponseEntity.badRequest().body("Failed to upload image.");
            } else {
                // 파일 저장 성공 시, 사용자 정보에 이미지 경로 업데이트
                UserEntity user = userService.updateUserProfileImage(userId, profileImage);
                if (user == null) {
                    return ResponseEntity.badRequest().body("Failed to update user profile with image.");
                }
                log.warn("파일 이름: {}", profileImage);
                return ResponseEntity.ok().body("Image uploaded successfully: " + profileImage);
            }
        } catch (Exception e) {
            log.error("Image upload failed", e);
            return ResponseEntity.internalServerError().body("Internal server error: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal String userId, @RequestHeader(value="Authorization") String token) {
        try {
            // 사용자 존재 여부 확인
            UserEntity user = userService.findUserById(Long.valueOf(userId));
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            token = token.substring(7);
            userService.blacklistToken(token);
            userService.deleteUser(Long.valueOf(userId));
            return ResponseEntity.ok().body("ID " + userId + "인 사용자가 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/social/login")
    public ResponseEntity<?> snsSignIn(@RequestBody Map<String, String> snsDetails) {
        try {
            String email = snsDetails.get("email");
            String nickname = snsDetails.get("nickname") + "_" + UUID.randomUUID().toString().substring(0, 4);
            String profileImage = "https://source.boringavatars.com/beam/120/" + nickname;
            UserEntity.LoginType loginType = UserEntity.LoginType.GOOGLE;

            UserDTO userDTO = userService.snsLoginOrCreateUser(email, nickname, loginType, profileImage);

            return ResponseEntity.ok().body(userDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}