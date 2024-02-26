    package studysns.server.dto;

    import lombok.Builder;
    import lombok.Data;
    import lombok.Getter;
    import lombok.Setter;


    @Data
    @Getter
    @Setter
    @Builder
    public class RankingDTO {
        private String profileImage;
        private String nickname;
        private String studyDate;
        private Long todayStudyTime;


    }