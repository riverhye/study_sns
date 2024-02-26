package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import studysns.server.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    // user의 nickname을 받아오기 위해 추가
    UserEntity findByNickname(String nickname);

    Optional<UserEntity> findByEmail(String email);

    boolean existsByNicknameAndUserIdNot(String nickname, Long userId);

    boolean existsByEmailAndUserIdNot(String email, Long userId);

    UserEntity findByUserId(Long userId);

    @Query("SELECT u.nickname FROM UserEntity u WHERE u.userId = :userId")
    String findNicknameByUserId(@Param("userId") Long userId);

    List<UserEntity> findByNicknameContaining(String nickname);
}
