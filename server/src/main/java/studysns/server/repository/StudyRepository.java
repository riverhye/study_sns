package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.StudyEntity;

import java.util.Optional;

public interface StudyRepository extends JpaRepository<StudyEntity, Long> {
    Optional<StudyEntity> findByStudyId(long studyId);
}
