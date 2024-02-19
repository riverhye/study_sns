package studysns.server.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import studysns.server.dto.TodoDTO;
import studysns.server.entity.TodoEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.TodoRepository;
import studysns.server.repository.UserRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
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
    public List<TodoDTO> getTodoByNicknameAndTodoDate(String nickname, LocalDate tododate) {

        UserEntity user = userRepository.findByNickname(nickname);
        if(user == null) {
            //yser 가  null일 경우
            throw new IllegalArgumentException("User not found");
        }
        log.warn("TodoDate: " + tododate.toString()); // LocalDateTime 값을 문자열로 변환하여 출력

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
        try {
            // todoRepository를 사용하여 Todo를 삭제
            todoRepository.deleteById(todoId);
            System.out.println("Todo 삭제가 완료되었습니다.");
        } catch (Exception e) {
            System.out.println("Todo 삭제 중 오류가 발생하였습니다: " + e.getMessage());
        }
}
}