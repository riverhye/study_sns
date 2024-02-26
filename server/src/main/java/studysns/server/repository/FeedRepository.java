package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import studysns.server.entity.FeedEntity;

import java.util.List;
import java.util.Optional;

public interface FeedRepository extends JpaRepository<FeedEntity, Long> {
    List<FeedEntity> findByUserUserId(long userId);

    @Query("SELECT f FROM FeedEntity f WHERE f.user.id = :userId ORDER BY f.studyStartPoint DESC")
    Optional<FeedEntity> findLatestFeedByUserId(@Param("userId") Long userId);


}
