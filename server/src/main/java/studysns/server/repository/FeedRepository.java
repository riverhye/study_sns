package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.FeedEntity;

import java.util.List;

public interface FeedRepository extends JpaRepository<FeedEntity, Long> {
    List<FeedEntity> findByFeedId(long feedId);
}
