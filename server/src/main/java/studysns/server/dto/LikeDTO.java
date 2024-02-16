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

    public long getLikeId() {
        return likeId;
    }

    public void setLikeId(long likeId) {
        this.likeId = likeId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getFeedId() {
        return feedId;
    }

    public void setFeedId(long feedId) {
        this.feedId = feedId;
    }

    public long getStudyId() {
        return studyId;
    }

    public void setStudyId(long studyId) {
        this.studyId = studyId;
    }
}
