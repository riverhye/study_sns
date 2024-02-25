package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder

public class FeedDTO {
    private Long feedId;
    private Long studyId;
    private Long userId;
    private String studyContent;
    private LocalDateTime studyStartPoint;
    private LocalDateTime studyEndPoint;

}
