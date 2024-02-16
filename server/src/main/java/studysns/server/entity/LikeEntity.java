package studysns.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "likeTable")
public class LikeEntity {

    @Id
    @Column(name = "likeId", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long likeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feedId", nullable = false)
    private FeedEntity feed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studyId", nullable = false)
    private FeedEntity study;

}
