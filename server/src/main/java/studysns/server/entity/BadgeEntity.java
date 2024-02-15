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
@Table(name = "badge")
public class BadgeEntity {

    @Id
    @Column(name = "badgeId", nullable = false)
    private long badgeId;

    @Column(name = "badgeName")
    private String badgeName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId") // 외래키를 지정. 여기서는 user_id가 외래키가 됨
    private UserEntity userEntity;

}
