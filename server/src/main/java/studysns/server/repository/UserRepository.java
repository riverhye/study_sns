package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    UserEntity findByEmail(String email);

    boolean existsByNicknameAndUserIdNot(String nickname, Long userId);

    boolean existsByEmailAndUserIdNot(String email, Long userId);
}
