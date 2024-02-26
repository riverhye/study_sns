package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import studysns.server.entity.StudyEntity;

import java.util.List;

public interface StudyRepository extends JpaRepository<StudyEntity, Long> {

    List<StudyEntity> findByUser_userId(Long userId);

//    StudyEntity findByUser_todayStudyTime(Long userId);

    @Query("SELECT s FROM StudyEntity s ORDER BY s.todayStudyTime DESC")
    List<StudyEntity> findTop20ByOrderByTodayStudyTimeDesc();
}
