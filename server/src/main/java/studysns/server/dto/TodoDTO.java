package studysns.server.dto;

import com.fasterxml.jackson.datatype.jsr310.deser.key.LocalDateKeyDeserializer;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TodoDTO {
    private long todoId;
    private long userId;
    private String todoContent;
    private LocalDateTime todoDate;

    public long getTodoId() {
        return todoId;
    }

    public void setTodoId(long todoId) {
        this.todoId = todoId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getTodoContent() {
        return todoContent;
    }

    public void setTodoContent(String todoContent) {
        this.todoContent = todoContent;
    }

    public LocalDateTime getTodoDate() {
        return todoDate;
    }

    public void setTodoDate(LocalDateTime todoDate) {
        this.todoDate = todoDate;
    }
}
