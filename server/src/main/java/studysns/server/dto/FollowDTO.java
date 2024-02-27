package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class FollowDTO {
    private Long followerId;
    private Long followId; // 기준 유저를 팔로우 하는 유저
    private Long userId; // 기준 유저
    private LocalDateTime followTime;
    private Long followingId;
    
}
