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
@Table(name = "follow")
public class FollowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follwerId", nullable = false)
    private long id;

    @Column(name = "followId")
    private long followId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId") // 외래키를 지정. 여기서는 user_id가 외래키가 됨
    private UserEntity userEntity;

}
