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
    private long userId;

    @Column(name = "email", length = 50, nullable = false)
    private String email;

    @Column(name = "nickname", length = 20, nullable = false)
    private String nickname;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "loginType", nullable = false)
    private LoginType loginType = LoginType.SNS;

    @Lob
    @Column(name = "profileImage")
    private String profileImage;

    @PrePersist
    public void prePersist() {
        this.loginType = this.loginType == null ? LoginType.SNS : this.loginType;
    }

    public enum LoginType{
        SNS, GOOGLE, KAKAO
    }

}
