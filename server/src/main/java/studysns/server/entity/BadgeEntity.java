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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long badgeId;

    @Column(name = "badgeName", nullable = false)
    private String badgeName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity userEntity;

}
