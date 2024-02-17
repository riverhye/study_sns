package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.TodoEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface TodoRepository extends JpaRepository<TodoEntity, Long> {

    List<TodoEntity> findByTodoDateAndUserEntity_UserId(LocalDateTime tododate, Long userId);
}
