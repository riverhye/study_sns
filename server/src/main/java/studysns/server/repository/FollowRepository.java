package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import studysns.server.entity.FollowEntity;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<FollowEntity, Long> {
    List<FollowEntity> findByUser_UserId(long userId);

    Long countByUser_userId(Long userId);
    Long countByUserFollowUserId(Long userId);

    List<FollowEntity> findByUserUserId(Long userId);

    Long countByUserUserId(Long userId);



}
