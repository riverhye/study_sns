package studysns.server.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import studysns.server.dto.AllStudyInfoDTO;
import studysns.server.dto.TodoDTO;
import studysns.server.service.BadgeService;
import studysns.server.service.StudyService;
import studysns.server.service.TodoService;
import studysns.server.service.UserService;

import java.util.List;


@RestController
@RequestMapping("/study")
public class StudyController {

    private final UserService userService;
    private final StudyService studyService;

    private final TodoService todoService;
//    private final BadgeService badgeService;

    @Autowired
    public StudyController(
            UserService userService,
            StudyService studyService,
            TodoService todoService
//            BadgeService badgeService
    ) {
        this.userService = userService;
        this.studyService = studyService;
        this.todoService = todoService;
//        this.badgeService = badgeService;
    }

    @GetMapping("/{nickname}")
    public ResponseEntity<AllStudyInfoDTO> getStudyByNickname(@PathVariable String nickname) {
        AllStudyInfoDTO.User userList = studyService.getUserByNickname(nickname);
        List<AllStudyInfoDTO.StudyTable> studyList = studyService.getStudyByNickname(nickname);
        List<AllStudyInfoDTO.Todo> todoList = todoService.getTodoByNickname(nickname);
//        AllStudyInfoDTO.Badge badgeList = badgeService.getBadgeByNickname(nickname);


        AllStudyInfoDTO allStudyInfoDTO = AllStudyInfoDTO.builder().
                user(userList).
                studyTable(studyList).
                todo(todoList).
//                badge(badgeList).
                build();

        return ResponseEntity.ok(allStudyInfoDTO);
    }
}
