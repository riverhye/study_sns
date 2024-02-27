package studysns.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
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

    @Column(name = "email", length = 50, nullable = false, unique = true)
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

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudyEntity> studies = new ArrayList<>();

    public void addStudy(StudyEntity study) {
        studies.add(study);
        study.setUser(this);
    }

    @PrePersist
    public void prePersist() {
        this.loginType = this.loginType == null ? LoginType.SNS : this.loginType;
    }

    @Builder
    public UserEntity(String email, String nickname, String password, LoginType loginType, String profileImage) {
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.loginType = loginType;
        this.profileImage = profileImage;
        this.studies = new ArrayList<>(); // 이 부분이 중요
    }

    public enum LoginType{
        SNS, GOOGLE
    }

}
