package studysns.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysns.server.dto.TodoDTO;
import studysns.server.entity.TodoEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.TodoRepository;
import studysns.server.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    @Autowired
    public TodoService(final TodoRepository todoRepository, final UserRepository userRepository ) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    public void makeTodo(TodoDTO todoDTO) {
        UserEntity userEntity = userRepository.findById(todoDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TodoEntity todoEntity = TodoEntity.builder()
                .userEntity(userEntity)
                .todoContent(todoDTO.getTodoContent())
                .todoDate(todoDTO.getTodoDate())
                .build();

        todoRepository.save(todoEntity);
    }
    public List<TodoDTO> getTodoByNicknameAndTodoDate(String nickname, LocalDateTime tododate) {

        UserEntity user = userRepository.findByNickname(nickname);
        if(user == null) {
            //yser 가  null일 경우
            throw new IllegalArgumentException("User not found");
        }

        List<TodoEntity> todoEntities = todoRepository.findByTodoDateAndUserEntity_UserId(tododate, user.getUserId());
        List<TodoDTO> todoDTOList = new ArrayList<>();
        for (TodoEntity entity : todoEntities) {
            TodoDTO dto = TodoDTO.builder()
                    .userId(entity.getUserEntity().getUserId())
                    .todoDate(entity.getTodoDate())
                    .build();
            todoDTOList.add(dto);
        }
        return todoDTOList;
    }



    public void deleteTodoById(long todoId) {
    }
}