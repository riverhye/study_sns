package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    // user의 nickname을 받아오기 위해 추가
    UserEntity findByNickname(String nickname);

    UserEntity findByEmail(String email);

    boolean existsByNicknameAndUserIdNot(String nickname, Long userId);

    boolean existsByEmailAndUserIdNot(String email, Long userId);
}
