package studysns.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "followeeId")
//    private UserEntity followee;
//
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;


    @Column(name = "followTime")
    private LocalDateTime followTime;
}
