package studysns.server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;


@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "study")
public class StudyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "studyId", nullable = false)
    private Long studyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private UserEntity user;

    @Column(name = "todayStudyTime", nullable = true)
    @ColumnDefault("'0'")
    private Long todayStudyTime;

    @Column(name = "studyDate", nullable = false)
    private LocalDate studyDate;

    public Long getTodayStudyTime() {
        return this.todayStudyTime;
    }


}
