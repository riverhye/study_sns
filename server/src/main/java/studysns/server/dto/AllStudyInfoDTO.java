package studysns.server.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class AllStudyInfoDTO {
    private User user;
    private List<StudyTable> studyTable;
    private List<Todo> todo;
    private MyRanking myRanking;
    private List<Badge> badge;

    @Data
    @Builder
    public static class User {
        private String nickname;
        private String email;
        private Long followerId;
        private Long followingId;
        private String userimage;
    }

    @Data
    @Builder
    public static class StudyTable {
        private Long todayStudyTime;
        private LocalDate studyDate;
    }
    @Data
    @Builder
    public static class Todo {
        private LocalDate todoDate;
        private String todoContent;
    }
    @Data
    @Builder
    public static class MyRanking {
        private String rankingDate;
        private Long rankingTime;
    }

    @Data
    @Builder
    public static class Badge {
        private String badge;
    }
}
