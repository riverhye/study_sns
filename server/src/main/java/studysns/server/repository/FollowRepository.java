package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.FollowEntity;

public interface FollowRepository extends JpaRepository<FollowEntity, Long> {
}
