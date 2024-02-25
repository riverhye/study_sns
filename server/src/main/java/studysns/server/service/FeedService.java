package studysns.server.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
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
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j

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

    public String playRequest(String userIdString, String studyContent) { // (String userIdString, String studyContent, String nickname)
        log.info("service userId: {}", userIdString);
        log.info("service studyContent: {}", studyContent);
//        log.info("service nickname: {}", nickname);

        long userId = Long.parseLong(userIdString);
        log.info("userId string: {}", userId);

        LocalDateTime now = LocalDateTime.now();

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        UserEntity userEntity = userOptional.get();

//        Optional<StudyEntity> studyOptional = studyRepository.findById(userId);
//        if (studyOptional.isEmpty()) {
//            throw new EntityNotFoundException("Study not found for the user");
//        }
//        StudyEntity studyEntity = studyOptional.get();
//        Long studyId = studyEntity.getStudyId();

        Optional<FeedEntity> existingFeedOptional = feedRepository.findById(userId);
        FeedEntity feedEntity;
//        String message;
        if (existingFeedOptional.isPresent()) {
            feedEntity = existingFeedOptional.get();
//            if (feedEntity.getStudyContent() != null) {
//                throw new IllegalStateException("StudyContent already exists");
//            }
            feedEntity.setStudyContent(studyContent);
            feedEntity.setStudyStartPoint(now);
            feedEntity.setStudyEndPoint(now);
//            message = "새로 시작 한 경우";
        } else {
            feedEntity = FeedEntity.builder()
                    .user(userEntity)
//                    .study(studyEntity)
                    .studyContent(studyContent)
                    .studyStartPoint(now)
                    .studyEndPoint(now)
                    .build();
//            message = "일시 정지 후 다시 시작한 경우";
        }

        feedRepository.save(feedEntity);
        log.info("FeedEntity play created: {}", feedEntity);

        String message = userEntity.getNickname() + " 님이 " + studyContent + " 공부를 시작했습니다."; // nickname + " 님이 " + studyContent + " 공부를 시작했습니다."
        return message;

    }

    public String stopRequest(String userIdString, String studyContent){
        LocalDateTime now = LocalDateTime.now();

        long userId = Long.parseLong(userIdString);

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        UserEntity userEntity = userOptional.get();


        Optional<FeedEntity> existingFeedOptional = feedRepository.findById(userId);
        FeedEntity feedEntity;
        if (existingFeedOptional.isPresent()) {
            feedEntity = existingFeedOptional.get();
            feedEntity.setStudyEndPoint(now);

            LocalDateTime studyStartPoint = feedEntity.getStudyStartPoint();
            LocalDateTime studyEndPoint = feedEntity.getStudyStartPoint();

            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);

            long studySeconds = studyDuration.getSeconds();
            long studyMinutes = studySeconds/60;

            Optional<StudyEntity> studyOptional = studyRepository.findById(userId);
            if (studyOptional.isPresent()){
                StudyEntity studyEntity = studyOptional.get();
                long updatedStudyTime = studyEntity.getTodayStudyTime() + studyMinutes;
                studyEntity.setTodayStudyTime(updatedStudyTime);
            } else {
                log.info("studyEntity 불러오는 중 오류. todayStudyTime 저장 하지 못함.");
            }

            feedEntity.setStudyStartPoint(null);
            feedEntity.setStudyEndPoint(null);
            feedEntity.setStudyContent(null);
        } else {
            feedEntity = FeedEntity.builder()
                    .user(userEntity)
                    .studyContent(studyContent)
                    .studyStartPoint(now)
                    .studyEndPoint(now)
                    .build();
        }

        feedRepository.save(feedEntity);
        log.info("FeedEntity stop created: {}", feedEntity);

        String message = userEntity.getNickname() + " 님이 " + studyContent + " 공부를 마쳤습니다.";
        return message;


    }

    public String pauseRequest(String userIdString, String studyContent){
        LocalDateTime now = LocalDateTime.now();

        long userId = Long.parseLong(userIdString);

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        UserEntity userEntity = userOptional.get();


        Optional<FeedEntity> existingFeedOptional = feedRepository.findById(userId);
        FeedEntity feedEntity;
        if (existingFeedOptional.isPresent()) {
            feedEntity = existingFeedOptional.get();
            feedEntity.setStudyEndPoint(now);

            LocalDateTime studyStartPoint = feedEntity.getStudyStartPoint();
            LocalDateTime studyEndPoint = feedEntity.getStudyStartPoint();

            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);

            long studySeconds = studyDuration.getSeconds();
            long studyMinutes = studySeconds/60;

            Optional<StudyEntity> studyOptional = studyRepository.findById(userId);
            if (studyOptional.isPresent()){
                StudyEntity studyEntity = studyOptional.get();
                long updatedStudyTime = studyEntity.getTodayStudyTime() + studyMinutes;
                studyEntity.setTodayStudyTime(updatedStudyTime);
            } else {
                log.info("studyEntity 불러오는 중 오류");
            }

            feedEntity.setStudyStartPoint(null);
            feedEntity.setStudyEndPoint(null);
//            feedEntity.setStudyContent(null);
        } else {
            feedEntity = FeedEntity.builder()
                    .user(userEntity)
                    .studyContent(studyContent)
                    .studyStartPoint(now)
                    .studyEndPoint(now)
                    .build();
        }

        feedRepository.save(feedEntity);
        log.info("FeedEntity pause created: {}", feedEntity);

        String message = userEntity.getNickname() + " 님이 잠시 휴식 중입니다.";
        return message;


    }
    }

