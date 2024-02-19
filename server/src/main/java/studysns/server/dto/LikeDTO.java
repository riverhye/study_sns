package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LikeDTO {
    private long likeId;
    private long userId;
    private long feedId;
    private long studyId;
}
