package studysns.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "follow")
public class FollowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "followerId", nullable = false)
    private long followerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followId", referencedColumnName = "userId")
    private UserEntity userFollow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;
}
