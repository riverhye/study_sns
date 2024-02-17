package studysns.server.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import studysns.server.dto.UserDTO;
import studysns.server.entity.UserEntity;
import studysns.server.security.TokenProvider;
import studysns.server.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @Autowired
    TokenProvider tokenProvider;

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

//    @PostMapping("/signin/process")
//    public ResponseEntity<?> loginUser(HttpSession session, @RequestBody UserDTO userDTO){
//        try{
//            UserEntity userEntity = userService.login(userDTO.getEmail(), userDTO.getPassword());
//            if(userEntity == null){
//                throw new RuntimeException("로그인 실패");
//            }
//
//            String token = tokenProvider.createToken(userEntity);
//
//            UserDTO responseUserDTO = UserDTO.builder()
//                    .email(userEntity.getEmail())
//                    .nickname(userEntity.getNickname())
//                    .userId(userEntity.getUserId())
//                    .token(token)
//                    .build();
//
//            return ResponseEntity.ok().body(responseUserDTO);
//        } catch (Exception e){
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
}
