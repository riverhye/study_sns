package studysns.server.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import studysns.server.dto.AllStudyInfoDTO;
import studysns.server.dto.TodoDTO;
import studysns.server.entity.UserEntity;
import studysns.server.service.*;

import java.util.List;


@RestController
@RequestMapping("/study")
public class StudyController {

    private final UserService userService;
    private final StudyService studyService;

    private final TodoService todoService;

    private  final  FollowService followService;
//    private final BadgeService badgeService;

    @Autowired
    public StudyController(
            UserService userService,
            StudyService studyService,
            TodoService todoService,
            FollowService followService
//            BadgeService badgeService
    ) {
        this.userService = userService;
        this.studyService = studyService;
        this.todoService = todoService;
        this.followService = followService;
//        this.badgeService = badgeService;
    }

    @GetMapping("/{nickname}")
    public ResponseEntity<AllStudyInfoDTO> getStudyByNickname(@PathVariable String nickname) {
        UserEntity user = userService.findByNickname(nickname);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Long userId = user.getUserId();

        AllStudyInfoDTO.User userFollowerInfo = followService.getFollowInfo(userId);
        List<AllStudyInfoDTO.StudyTable> studyList = studyService.getStudyByNickname(userId);
        List<AllStudyInfoDTO.Todo> todoList = todoService.getTodoByNickname(userId);
//        AllStudyInfoDTO.MyRanking myRanking = studyService.getMyRankingByNickname(nickname);
//        AllStudyInfoDTO.Badge badgeList = badgeService.getBadgeByNickname(nickname);


        AllStudyInfoDTO allStudyInfoDTO = AllStudyInfoDTO.builder().
                user(userFollowerInfo).
                studyTable(studyList).
                todo(todoList).
//                myRanking(myRanking).
//                badge(badgeList).
                build();

        return ResponseEntity.ok(allStudyInfoDTO);
    }
}
