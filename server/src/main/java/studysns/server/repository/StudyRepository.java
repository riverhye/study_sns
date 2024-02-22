package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.StudyEntity;

import java.util.List;

public interface StudyRepository extends JpaRepository<StudyEntity, Long> {

    List<StudyEntity> findByUser_userId(Long userId);
}
