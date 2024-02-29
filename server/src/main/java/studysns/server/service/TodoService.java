package studysns.server.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import studysns.server.dto.AllStudyInfoDTO;
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
                .user(userEntity)
                .todoContent(todoDTO.getTodoContent())
                .todoDate(todoDTO.getTodoDate())
                .build();

        todoRepository.save(todoEntity);
    }
    public List<TodoDTO> getTodoByNicknameAndTodoDate(String nickname, LocalDate tododate) {
        List<TodoDTO> todoDTOList = new ArrayList<>();

        // 사용자 조회
        UserEntity user = userRepository.findByNickname(nickname);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        // 할 일 목록 조회
        List<TodoEntity> todoEntities = todoRepository.findByTodoDateAndUser_Nickname(tododate, nickname);
        for (TodoEntity entity : todoEntities) {
            TodoDTO dto = TodoDTO.builder()
                    .todoId(entity.getTodoId())
                    .userId(entity.getUser().getUserId())
                    .nickname(entity.getUser().getNickname())
                    .todoContent(entity.getTodoContent())
                    .todoDate(entity.getTodoDate())
                    .build();
            todoDTOList.add(dto);
        }
        return todoDTOList;
    }

    public List<AllStudyInfoDTO.Todo> getTodoByNickname(Long userId) {
        List<AllStudyInfoDTO.Todo> todoDTOList = new ArrayList<>();

        // 할 일 목록 조회
        List<TodoEntity> todoEntities = todoRepository.findByUser_UserId(userId);
        for (TodoEntity entity : todoEntities) {
            AllStudyInfoDTO.Todo dto = AllStudyInfoDTO.Todo.builder()
                    .todoContent(entity.getTodoContent())
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