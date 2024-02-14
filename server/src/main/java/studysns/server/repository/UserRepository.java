package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}
