package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class StudyDTO {
    private Long studyId;
    private Long userId;
    private Long todayStudyTime;
    private LocalDate studyDate;
    private String nickname;

    public Long getStudyId() {
        return studyId;
    }

    public void setStudyId(Long studyId) {
        this.studyId = studyId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTodayStudyTime() {
        return todayStudyTime;
    }

    public void setTodayStudyTime(Long todayStudyTime) {
        this.todayStudyTime = todayStudyTime;
    }

    public LocalDate getStudyDate() {
        return studyDate;
    }

    public void setStudyDate(LocalDate studyDate) {
        this.studyDate = studyDate;
    }
}
