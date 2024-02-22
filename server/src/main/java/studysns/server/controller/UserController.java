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

    @PostMapping("/signup/process")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            UserEntity userEntity = UserEntity.builder()
                    .email(userDTO.getEmail())
                    .nickname(userDTO.getNickname())
                    .password(passwordEncoder.encode(userDTO.getPassword()))
                    .profileImage(userDTO.getProfileImage())
                    .loginType(userDTO.getLoginType())
                    .build();

            UserEntity responseUser = userService.createUser(userEntity);

            UserDTO responseUserDTO = UserDTO.builder()
                    .email(responseUser.getEmail())
                    .nickname(responseUser.getNickname())
                    .password(responseUser.getPassword())
                    .loginType(responseUser.getLoginType())
                    .profileImage(responseUser.getProfileImage())
                    .userId(responseUser.getUserId())
                    .build();
            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signin/process")
    public ResponseEntity<?> loginUser(@RequestBody UserDTO userDTO){
        try{
            UserEntity userEntity = userService.login(userDTO.getEmail(), userDTO.getPassword());
            if(userEntity == null){
                throw new RuntimeException("로그인 실패");
            }

            String token = tokenProvider.createToken(userEntity);

            UserDTO responseUserDTO = UserDTO.builder()
//                    .email(userEntity.getEmail())
//                    .nickname(userEntity.getNickname())
//                    .password(userEntity.getPassword())
//                    .userId(userEntity.getUserId())
//                    .profileImage(userEntity.getProfileImage())
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

    @PatchMapping("/editprofile/process/{userId}")
    public ResponseEntity<?> editUserProfile(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        try {
            // 사용자 ID를 기반으로 기존 사용자 검색
            UserEntity existingUser = userService.findUserById(userId);
            if (existingUser == null) {
                return ResponseEntity.notFound().build();
            }

            // 받은 DTO로부터 사용자 정보 업데이트
            existingUser.setEmail(userDTO.getEmail());
            existingUser.setNickname(userDTO.getNickname());
            // 비밀번호 변경 시, 암호화 처리
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }
            existingUser.setLoginType(userDTO.getLoginType());
            existingUser.setProfileImage(userDTO.getProfileImage());

            // 사용자 정보 업데이트
            UserEntity updatedUser = userService.updateUser(existingUser);

            // 응답 DTO 생성
            UserDTO responseUserDTO = UserDTO.builder()
                    .email(updatedUser.getEmail())
                    .nickname(updatedUser.getNickname())
                    .password(updatedUser.getPassword()) // 응답에 비밀번호 포함을 피함
                    .loginType(updatedUser.getLoginType())
                    .profileImage(updatedUser.getProfileImage())
                    .userId(updatedUser.getUserId())
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/editprofile/image/{userId}")
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

    @PostMapping("/editprofile/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            // 사용자 존재 여부 확인
            UserEntity user = userService.findUserById(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // 사용자 삭제
            userService.deleteUser(userId);
            return ResponseEntity.ok().body("ID " + userId + "인 사용자가 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}