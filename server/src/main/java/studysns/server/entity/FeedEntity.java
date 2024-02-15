package studysns.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "feed")
public class FeedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedId", nullable = false)
    private long feedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "studyId", nullable = false)
    private StudyEntity study;

    @ManyToOne(fetch = FetchType.LAZY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "userid", nullable = false)
    private UserEntity user;

    @Column(name = "studyContent", nullable = false)
    private long studyContent;

    @Column(name = "studyStartPoint", nullable = false)
    private LocalDateTime studyStartPoint;

    @Column(name = "studyEndPoint", nullable = false)
    private LocalDateTime studyEndPoint;
}
