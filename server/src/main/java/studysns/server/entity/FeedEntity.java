package studysns.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "feed")
public class FeedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedId", nullable = false)
    private long feedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId", nullable = true)
    private StudyEntity study;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private UserEntity user;

    @Column(name = "studyContent", nullable = true)
    private String studyContent;

    @Column(name = "studyStartPoint", nullable = true)
    private LocalDateTime studyStartPoint;

    @Column(name = "studyEndPoint", nullable = true)
    private LocalDateTime studyEndPoint;
}
