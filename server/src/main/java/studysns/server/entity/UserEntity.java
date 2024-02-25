package studysns.server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId", nullable = false)
    private Long userId;

    @Column(name = "email", length = 50, nullable = false)
    private String email;

    @Column(name = "nickname", length = 50, nullable = false)
    private String nickname;

    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "loginType", nullable = false)
    private LoginType loginType = LoginType.SNS;

    @Column(name = "profileImage", length = 255)
    private String profileImage;

    @PrePersist
    public void prePersist() {
        this.loginType = this.loginType == null ? LoginType.SNS : this.loginType;
    }

    public enum LoginType{
        SNS, GOOGLE, KAKAO
    }

}
