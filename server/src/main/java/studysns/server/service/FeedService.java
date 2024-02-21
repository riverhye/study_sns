package studysns.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysns.server.dto.FeedDTO;
import studysns.server.dto.StudyDTO;
import studysns.server.entity.FeedEntity;
import studysns.server.entity.StudyEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.FeedRepository;
import studysns.server.repository.StudyRepository;
import studysns.server.repository.UserRepository;


import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service

public class FeedService {

    @Autowired

    private final FeedRepository feedRepository;
    private final UserRepository userRepository;
    private final StudyRepository studyRepository;

    @Autowired FeedService(FeedRepository feedRepository, UserRepository userRepository, StudyRepository studyRepository){
        this.feedRepository = feedRepository;
        this.userRepository = userRepository;
        this.studyRepository = studyRepository;
    }

    public void addFeed(FeedDTO feedDTO) {
        UserEntity userEntity = userRepository.findById(feedDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        StudyEntity studyEntity = studyRepository.findById(feedDTO.getStudyId())
                .orElseThrow(() -> new EntityNotFoundException("Study not found"));

        FeedEntity feedEntity = FeedEntity.builder()
                .study(studyEntity)
                .user(userEntity)
                .studyContent(feedDTO.getStudyContent())
                .studyStartPoint(feedDTO.getStudyStartPoint())
                .studyEndPoint(feedDTO.getStudyEndPoint())
                .build();

        feedRepository.save(feedEntity);
    }

    public List<FeedDTO> getFeedByUserId(long userId) {
        List<FeedEntity> feedEntities = feedRepository.findByUserUserId(userId);
        List<FeedDTO> feedDTOList = new ArrayList<>();
        for (FeedEntity entity : feedEntities) {
            FeedDTO dto = FeedDTO.builder()
                    .feedId(entity.getFeedId())
                    .studyId(entity.getStudy().getStudyId())
                    .userId(entity.getUser().getUserId())
                    .studyContent(entity.getStudyContent())
                    .studyStartPoint(entity.getStudyStartPoint())
                    .studyEndPoint(entity.getStudyEndPoint())
                    .build();
            feedDTOList.add(dto);
        }
        return feedDTOList;
    }

//    public StudyDTO playStudy(FeedDTO feedDTO, StudyDTO studyDTO) {
//        LocalDateTime now = LocalDateTime.now(); // 현재 시간
//
//        // 일시 정지 했다가 다시 시작하는 경우
//        if (feedDTO.getStudyStartPoint() != null) {
//            // 기존의 기록을 삭제하고 새로운 기록을 시작
//            feedDTO.setStudyStartPoint(now);
//            feedDTO.setStudyEndPoint(now);
//
//            // 매 초마다 studyEndPoint 를 업데이트하는 스케줄러 시작
//            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
//            scheduler.scheduleAtFixedRate(() -> {
//                LocalDateTime studyEndPoint = LocalDateTime.now();
//                feedDTO.setStudyEndPoint(studyEndPoint);
//            }, 0, 5, TimeUnit.SECONDS); // 5초마다 추가된 시간이 EndPoint로 업데이트 | 테스트 과정에서 확인하기 편하도록 초로 설정했음. ***********배포시 꼭 변경***************
//
//        } else {
//            // 정지 또는 처음 시작을 하는 경우
//            feedDTO.setStudyStartPoint(now);
//            feedDTO.setStudyEndPoint(now);
//
//            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
//            scheduler.scheduleAtFixedRate(() -> {
//                LocalDateTime studyEndPoint = LocalDateTime.now();
//                feedDTO.setStudyEndPoint(studyEndPoint);
//            }, 0, 5, TimeUnit.SECONDS);
//        }
//
//        return studyDTO;
//    }

//    public StudyDTO stopStudy(FeedDTO feedDTO, StudyDTO studyDTO) {
//        LocalDateTime studyStartPoint = feedDTO.getStudyStartPoint();
//        LocalDateTime studyEndPoint = LocalDateTime.now();
//
//        if (studyStartPoint != null) {
//            // Calculate study duration in seconds
//            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);
//            long studySeconds = studyDuration.getSeconds();
//
//            // Convert study duration to minutes
//            long studyMinutes = studySeconds / 60;
//
//            // Update todayStudyTime in studyDTO
//            long updatedStudyTime = studyDTO.getTodayStudyTime() + studyMinutes;
//            studyDTO.setTodayStudyTime(updatedStudyTime);
//
//            // Delete studyStartPoint and studyEndPoint from feedDTO
//            feedDTO.setStudyStartPoint(null);
//            feedDTO.setStudyEndPoint(null);
//
//            return studyDTO;
//        }
//
//        return null; // Or handle the case where studyStartPoint is null
//    }
//
//    public StudyDTO pauseStudy(FeedDTO feedDTO, StudyDTO studyDTO) {
//        LocalDateTime studyStartPoint = feedDTO.getStudyStartPoint();
//        LocalDateTime studyEndPoint = LocalDateTime.now();
//
//        if (studyStartPoint != null) {
//            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);
//            long studySeconds = studyDuration.getSeconds();
//
//            long studyMinutes = studySeconds / 60;
//
//            long updatedStudyTime = studyDTO.getTodayStudyTime() + studyMinutes;
//            studyDTO.setTodayStudyTime(updatedStudyTime);
//
//            // 여기에서 의미는 일단 휴식중인 시간이 기록됨
//            if (studyStartPoint != null) {
//                feedDTO.setStudyStartPoint(null);
//                feedDTO.setStudyEndPoint(null);
//
//                LocalDateTime now = LocalDateTime.now();
//
//                feedDTO.setStudyStartPoint(now);
//
//                feedDTO.setStudyEndPoint(now);
//
//                ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
//                scheduler.scheduleAtFixedRate(() -> {
//                    LocalDateTime newStudyEndPoint = LocalDateTime.now();
//                    feedDTO.setStudyEndPoint(newStudyEndPoint);
//                }, 0, 5, TimeUnit.SECONDS); // *********************배포시 변경**************************
//            }
//        }
//            return studyDTO;
//        }

    }

