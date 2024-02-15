package studysns.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import studysns.server.entity.TodoEntity;

public interface TodoRepository extends JpaRepository<TodoEntity, Long> {
}
