package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.BadgeEntity;

public interface BadgeReposiity extends JpaRepository<BadgeEntity, Long> {
}
