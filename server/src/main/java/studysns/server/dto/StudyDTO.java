package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class StudyDTO {
    private long studyId;
    private long userId;
    private long todayStudyTime;
    private LocalDateTime studyDate;
}
