package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.TodoEntity;

import java.time.LocalDate;
import java.util.List;

public interface TodoRepository extends JpaRepository<TodoEntity, Long> {
    List<TodoEntity> findByTodoDateAndUser_Nickname(LocalDate todoDate, String nickname);
    List<TodoEntity> findByUser_UserId(Long userId);

    List<TodoEntity> findByUser_userId(Long userId);
}