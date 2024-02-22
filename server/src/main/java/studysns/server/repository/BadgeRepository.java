package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.BadgeEntity;

public interface BadgeRepository extends JpaRepository<BadgeEntity, Long> {

}
