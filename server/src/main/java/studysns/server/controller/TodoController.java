package studysns.server.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import studysns.server.dto.TodoDTO;
import studysns.server.service.TodoService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/study")
public class TodoController {

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) { this.todoService = todoService; }

    @PostMapping("/maketodo")
    public ResponseEntity<String> makeTodo(@AuthenticationPrincipal String userId, @RequestBody TodoDTO todoDTO) {
        TodoDTO insertData = TodoDTO.builder()
                .userId(Long.valueOf(userId))
                .todoContent(todoDTO.getTodoContent())
                .todoDate(todoDTO.getTodoDate())
                .build();

        todoService.makeTodo(insertData);
        return ResponseEntity.status(HttpStatus.CREATED).body("Todo 작성 성공");
    }

    @GetMapping("/gettodo/{nickname}/{todoDate}")
    public ResponseEntity<List<TodoDTO>> getTodoByNicknameAndTodoDate(@PathVariable String nickname, @PathVariable LocalDate todoDate) {
        List<TodoDTO> todoList = todoService.getTodoByNicknameAndTodoDate(nickname, todoDate);
        return ResponseEntity.ok(todoList);
    }

    @DeleteMapping("/deletetodo/{todoId}")
    public ResponseEntity<String> deleteTodo(@PathVariable long todoId) {
        todoService.deleteTodoById(todoId);
        return ResponseEntity.ok("Todo 삭제 성공");
    }
}