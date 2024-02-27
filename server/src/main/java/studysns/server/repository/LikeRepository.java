package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.FeedEntity;
import studysns.server.entity.LikeEntity;
import studysns.server.entity.UserEntity;

import java.util.List;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    List<LikeEntity> findByUserUserId(long userId);

    LikeEntity findByUserAndFeed(UserEntity user, FeedEntity feed);
}
