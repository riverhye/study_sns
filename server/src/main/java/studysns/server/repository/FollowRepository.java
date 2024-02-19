package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import studysns.server.entity.FollowEntity;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<FollowEntity, Long> {
    List<FollowEntity> findByUserUserId(long userId);
}
