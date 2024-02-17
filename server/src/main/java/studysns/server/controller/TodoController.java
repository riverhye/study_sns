package studysns.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysns.server.dto.TodoDTO;
import studysns.server.service.TodoService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/study")
public class TodoController {

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) { this.todoService = todoService; }

    @PostMapping("/maketodo")
    public ResponseEntity<String> makeTodo(@RequestBody TodoDTO todoDTO) {
        todoService.makeTodo(todoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Todo 작성 성공");
    }
    @GetMapping("/gettodo/{nickname}/{todoDate}")
    public ResponseEntity<List<TodoDTO>> getTodgetoByNicknameAndTodoDate(@PathVariable String nickname, @PathVariable LocalDateTime tododate) {
        List<TodoDTO> todoList = todoService.getTodoByNicknameAndTodoDate(nickname, tododate);
        return ResponseEntity.ok(todoList);
    }

    @DeleteMapping("/deletetodo/{todoId}")
    public ResponseEntity<String> deleteTodo(@PathVariable long todoId) {
        todoService.deleteTodoById(todoId);
        return ResponseEntity.ok("Todo 삭제 성공");
    }
}