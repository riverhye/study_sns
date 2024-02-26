package studysns.server.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import studysns.server.dto.UserDTO;
import studysns.server.entity.UserEntity;
import studysns.server.repository.UserRepository;
import studysns.server.security.TokenProvider;
import studysns.server.socket.WebSocketHandler;

import java.io.File;
import java.util.*;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private WebSocketHandler webSocketHandler;

    // 토큰에서 사용자 ID 추출 메소드
    private String getUserIdFromToken(String token) {
        return tokenProvider.validateAndGetUserId(token);
    }

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 토큰 블랙리스트 관리를 위한 필드 추가
    private final Set<String> tokenBlacklist = Collections.synchronizedSet(new HashSet<>());

    public UserEntity createUser(UserEntity userEntity) {
        if(userEntity == null){
            throw new RuntimeException("Entity is Null");
        }

        String nickname = userEntity.getNickname();
        String email = userEntity.getEmail();

        if(userRepository.existsByNickname(nickname)){
            throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }

        if(userRepository.existsByEmail(email)){
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        return userRepository.save(userEntity);

    }

    public UserEntity login(String email, String password) {
        UserEntity searchUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if(passwordEncoder.matches(password, searchUser.getPassword())){
            return searchUser;
        }
        return null;
    }

    // 로그아웃 메소드 내용 업데이트
    public void logout(String token) {
        String userId = getUserIdFromToken(token);
        if (userId != null) {
            webSocketHandler.removeRoomByUserId(userId); // 해당 사용자의 소켓 훔 제거
        }
        blacklistToken(token); // 로그아웃 시 토큰을 블랙리스트에 추가
    }

    // TokenBlacklistService에서 가져온 메소드
    public void blacklistToken(String token) {
        tokenBlacklist.add(token);
    }

    public UserEntity findUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public UserEntity updateUser(UserEntity userEntity) {
        if (userEntity == null || userEntity.getUserId() == 0) {
            throw new RuntimeException("업데이트할 사용자 정보가 유효하지 않습니다.");
        }

        // 현재 업데이트하려는 사용자와 동일한 ID를 가진 사용자를 제외하고 동일한 nickname 또는 email을 사용하는 사용자가 있는지 확인
        String nickname = userEntity.getNickname();
        String email = userEntity.getEmail();
        Long userId = userEntity.getUserId();

        boolean nicknameExists = userRepository.existsByNicknameAndUserIdNot(nickname, userId);
        if (nicknameExists) {
            throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }

        boolean emailExists = userRepository.existsByEmailAndUserIdNot(email, userId);
        if (emailExists) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        // 사용자 정보 업데이트
        if (userRepository.existsById(userId)) {
            return userRepository.save(userEntity);
        } else {
            throw new RuntimeException("업데이트 할 사용자를 찾을 수 없습니다.");
        }
    }

    public String saveProfileImage(MultipartFile profileImageFile) {
        if (profileImageFile == null || profileImageFile.isEmpty()) {
            return null;
        }
        try {
            String originalFilename = profileImageFile.getOriginalFilename();
            String newFilename = UUID.randomUUID().toString();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String storageFilename = newFilename + fileExtension;

            // 파일 저장 위치 지정
            String storagePath = uploadDir + "/" + storageFilename;

            // 디렉토리 생성
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs(); // 디렉토리가 없으면 생성
            }

            File destinationFile = new File(storagePath);
            profileImageFile.transferTo(destinationFile);

            return storageFilename; // UUID로 변환된 파일명 저장
        } catch (Exception e) {
            log.error("Failed to save profile image", e);
            return null;
        }
    }

    public UserEntity updateUserProfileImage(Long userId, String profileImagePath) {
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            user.setProfileImage(profileImagePath);
            return userRepository.save(user); // 업데이트된 사용자 정보 저장
        }
        return null; // 사용자를 찾지 못한 경우
    }

    public void deleteUser(Long userId) {
        // 사용자 존재 여부 확인
        Optional<UserEntity> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다");
        }

        // 사용자 삭제
        userRepository.deleteById(userId);
    }

//    public boolean isTokenBlacklisted(String token) {
//        return tokenBlacklist.contains(token);
//    }

    public String getNicknameFromUserId(Long userId) {
        UserEntity userEntity = userRepository.findByUserId(userId);
        if (userEntity != null) {
            return userEntity.getNickname();
        } else {
            return null;
        }
    }

    public UserDTO snsLoginOrCreateUser(String email, String nickname, UserEntity.LoginType loginType, String profileImage) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserEntity newUser = UserEntity.builder()
                            .email(email)
                            .nickname(nickname)
                            .loginType(loginType)
                            .profileImage(profileImage)
                            .build();
                    // SNS 사용자는 비밀번호가 없을 수 있으므로, 엔티티가 이를 준비해야 합니다.
                    // 보안 요구사항에 따라 여기에 기본값 또는 null 비밀번호를 설정해야 할 수 있습니다.
                    return userRepository.save(newUser);
                });

        String token = tokenProvider.createToken(userEntity);

        return UserDTO.builder()
                .userId(userEntity.getUserId())
                .email(userEntity.getEmail())
                .nickname(userEntity.getNickname())
                .profileImage(userEntity.getProfileImage())
                .loginType(userEntity.getLoginType())
                .token(token)
                .build();
    }

    public UserEntity findByNickname(String nickname) {
        UserEntity user = userRepository.findByNickname(nickname);

        return user;
    }
}