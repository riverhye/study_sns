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

    @Column(name = "followId")
    private long followId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity userEntity;

    public void setFollowId(long followId)
    {
        this.followId = followId;
    }

}
