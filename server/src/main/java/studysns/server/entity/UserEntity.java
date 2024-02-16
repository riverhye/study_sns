package studysns.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId", nullable = false)
    private long userId;

    @Column(name = "email", length = 25, nullable = false)
    private String email;

    @Column(name = "nickname", length = 20, nullable = false)
    private String nickname;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @ColumnDefault("'SNS'")
    private LoginType loginType;

    @Lob
    @Column(name = "profileImage")
    private String profileImage;

    public enum LoginType{
        SNS, GOOGLE, KAKAO
    }

}
