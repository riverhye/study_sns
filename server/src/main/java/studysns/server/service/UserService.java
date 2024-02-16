package studysns.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysns.server.entity.UserEntity;
import studysns.server.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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
}
