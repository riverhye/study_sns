package studysns.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "todo")
public class TodoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "todoId", nullable = false)
    private long todoId;

    @Column(name = "todoContent", nullable = false)
    private String todoContent;

    @Column(name = "todoDate", nullable = false)
    private LocalDateTime todoDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "userId") // 외래키를 지정. 여기서는 user_id가 외래키가 됨
    private UserEntity userEntity;
}
