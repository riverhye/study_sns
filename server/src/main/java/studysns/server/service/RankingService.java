package studysns.server.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import studysns.server.dto.AllStudyInfoDTO;
import studysns.server.dto.RankingDTO;
import studysns.server.dto.StudyDTO;
import studysns.server.entity.StudyEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.StudyRepository;
import studysns.server.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequestMapping("/ranking")
public class RankingService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudyRepository studyRepository;

    public List<RankingDTO> getRankingList() {
        List<StudyEntity> top20StudyList = studyRepository.findTop20ByOrderByTodayStudyTimeDesc();

        List<RankingDTO> rankingList = new ArrayList<>();

        for (StudyEntity studyEntity : top20StudyList) {
            String nickname = studyEntity.getUser().getNickname();
            String profileImage = studyEntity.getUser().getProfileImage();
            String studyDate = studyEntity.getStudyDate().toString(); // 이 부분은 날짜에 맞게 수정 필요
            Long todayStudyTime = studyEntity.getTodayStudyTime();

            RankingDTO rankingDTO = RankingDTO.builder()
                    .nickname(nickname)
                    .profileImage(profileImage)
                    .studyDate(studyDate)
                    .todayStudyTime(todayStudyTime)
                    .build();

            rankingList.add(rankingDTO);
        }

        return rankingList;
    }

//    public AllStudyInfoDTO.MyRanking getMyRankingByNickname(String nickname) {
//        UserEntity user = userRepository.findByNickname(nickname);
//        if (user == null) {
//            throw new IllegalArgumentException("사용자를 찾을 수 없습니다");
//        }
//
//        StudyEntity latestStudy = studyRepository.findTopByUserOrderByTodayStudyTimeDesc(user);
//        if (latestStudy == null) {
//            throw new IllegalArgumentException("사용자에 대한 학습 기록을 찾을 수 없습니다");
//        }
//
//        String rankingDate = latestStudy.getStudyDate().toString();
//        Long rankingTime = latestStudy.getTodayStudyTime();
//
//        return AllStudyInfoDTO.MyRanking.builder()
//                .rankingDate(rankingDate)
//                .rankingTime(rankingTime)
//                .build();
//    }
}