package studysns.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import studysns.server.entity.UserEntity;
import studysns.server.repository.UserRepository;

import java.util.Collections;
import java.util.HashSet;
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

//    public boolean isTokenBlacklisted(String token) {
//        return tokenBlacklist.contains(token);
//    }
}
