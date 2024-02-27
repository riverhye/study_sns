package studysns.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import studysns.server.dto.AllStudyInfoDTO;
import studysns.server.dto.StudyDTO;
import studysns.server.entity.StudyEntity;
import studysns.server.entity.TodoEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.BadgeRepository;
import studysns.server.repository.StudyRepository;
import studysns.server.repository.TodoRepository;
import studysns.server.repository.UserRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequestMapping("/study")
public class StudyService {

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;
    private final TodoRepository todoRepository;
    private final BadgeRepository badgeRepository;

    @Autowired
    public StudyService( final StudyRepository studyRepository,
                         final UserRepository userRepository,
                         final TodoRepository todoRepository,
                         final BadgeRepository badgeRepository ) {
        this.studyRepository = studyRepository;
        this.userRepository = userRepository;
        this.todoRepository = todoRepository;
        this.badgeRepository = badgeRepository;
    }

    public AllStudyInfoDTO.User getUserByNickname(String nickname) {

        UserEntity user = userRepository.findByNickname(nickname);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        return AllStudyInfoDTO.User.builder()
                .nickname(user.getNickname())
                .email(user.getEmail())
                .build();
    }
    public List<AllStudyInfoDTO.StudyTable> getStudyByNickname(Long userId) {
        List<AllStudyInfoDTO.StudyTable> studyDTOList = new ArrayList<>();

        // study repo 에서 메소드
        // user.getUserId()를 이용해서 조회하는 findByUser_userId
        List<StudyEntity> studyEntities = studyRepository.findByUser_userId(userId);

        for (StudyEntity entity : studyEntities) {
            AllStudyInfoDTO.StudyTable dto = AllStudyInfoDTO.StudyTable.builder()
                    .todayStudyTime(entity.getTodayStudyTime())
                    .studyDate(entity.getStudyDate())
                    .build();

            studyDTOList.add(dto);
        }
        return studyDTOList;
    }

    public List<AllStudyInfoDTO.Todo> getTodoByNickname(String nickname) {
        List<AllStudyInfoDTO.Todo> todoDTOList = new ArrayList<>();

        UserEntity user = userRepository.findByNickname(nickname);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        // study repo 에서 메소드
        // user.getUserId()를 이용해서 조회하는 findByUser_userId
        List<TodoEntity> todoEntities = todoRepository.findByUser_userId(user.getUserId());

        for (TodoEntity entity : todoEntities) {
            AllStudyInfoDTO.Todo dto = AllStudyInfoDTO.Todo.builder()
                    .todoDate(entity.getTodoDate())
                    .todoContent(entity.getTodoContent())
                    .build();

            todoDTOList.add(dto);
        }
        return todoDTOList;
    }



    public AllStudyInfoDTO.MyRanking getMyRanking (Long userId) {
        StudyEntity studyEntity = studyRepository.findFirstByUser_UserIdOrderByTodayStudyTimeDesc(userId);

        AllStudyInfoDTO.MyRanking myRanking = AllStudyInfoDTO.MyRanking.builder()
                .rankingTime(studyEntity.getTodayStudyTime())
                .rankingDate(String.valueOf(studyEntity.getStudyDate()))
                .build();

        return myRanking;
    }

//    public AllStudyInfoDTO.Badge getBadgeByNickname(String nickname) {
//
//        UserEntity user = userRepository.findByNickname(nickname);
//        if (user == null) {
//            throw new IllegalArgumentException("User not found");
//        }
//
//        return AllStudyInfoDTO.Badge.builder()
//                .badgeName(user.getBadgeName())
//                .build();
//    }

}