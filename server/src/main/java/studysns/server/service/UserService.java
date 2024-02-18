package studysns.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import studysns.server.entity.UserEntity;
import studysns.server.repository.UserRepository;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

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
        UserEntity searchUser = userRepository.findByEmail(email);

        if(searchUser != null && passwordEncoder.matches(password, searchUser.getPassword())){
            return searchUser;
        }
        return null;
    }

    // 로그아웃 메소드 내용 업데이트
    public void logout(String token) {
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
}
