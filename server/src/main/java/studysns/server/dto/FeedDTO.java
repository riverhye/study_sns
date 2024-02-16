package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder

public class FeedDTO {
    private long feedId;
    private long studyId;
    private long userId;
    private String studyContent;
    private LocalDateTime studyStartPoint;
    private LocalDateTime studyEndPoint;

}
