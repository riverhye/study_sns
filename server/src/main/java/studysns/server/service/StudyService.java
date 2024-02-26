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

import java.util.ArrayList;
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

//    public AllStudyInfoDTO.MyRanking getMyRankingByNickname(String nickname) {
//        UserEntity user = userRepository.findByNickname(nickname);
//        if (user == null) {
//            throw new IllegalArgumentException("사용자를 찾을 수 없습니다");
//        }
//
//        // 사용자의 최신 학습 기록을 가져옵니다
//        StudyEntity latestStudy = studyRepository.findByUser_todayStudyDate(user.getUserId());
//
//        if (latestStudy == null) {
//            // 사용자에 대한 학습 기록이 없는 경우 처리
//            throw new IllegalArgumentException("사용자에 대한 학습 기록을 찾을 수 없습니다");
//        }
//
//        return AllStudyInfoDTO.MyRanking.builder()
//                .rankingDate(latestStudy.getRankingDate())
//                .rankingTime(StudyDTO.getStudyDate().toString())
//                .build();
//    }

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