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

//    public String playRequest(String userIdString, String studyContent) { // (String userIdString, String studyContent, String nickname)
//        log.info("service userId: {}", userIdString);
//        log.info("service studyContent: {}", studyContent);
////        log.info("service nickname: {}", nickname);
//
//        long userId = Long.parseLong(userIdString);
//        log.info("userId string: {}", userId);
//
//        LocalDateTime now = LocalDateTime.now();
//
//        Optional<UserEntity> userOptional = userRepository.findById(userId);
//        if (userOptional.isEmpty()) {
//            throw new EntityNotFoundException("User not found");
//        }
//
//        UserEntity userEntity = userOptional.get();
//
////        Optional<StudyEntity> studyOptional = studyRepository.findById(userId);
////        if (studyOptional.isEmpty()) {
////            throw new EntityNotFoundException("Study not found for the user");
////        }
////        StudyEntity studyEntity = studyOptional.get();
////        Long studyId = studyEntity.getStudyId();
//
//        Optional<FeedEntity> existingFeedOptional = feedRepository.findById(userId);
//        FeedEntity feedEntity;
//        String message;
//
//        if (existingFeedOptional.isPresent()) {
//            feedEntity = existingFeedOptional.get();
//            if (feedEntity.getStudyContent() != null) { // feedEntity 에 studyContent 가 이미 존재할때
////                throw new IllegalStateException("StudyContent already exists");
////                feedEntity.setStudyContent(studyContent);
//                feedEntity.setStudyStartPoint(now);
//                feedEntity.setStudyEndPoint(now);
//                message = "일시 정지 후 다시 시작한 경우";
//            } else {
//                feedEntity = FeedEntity.builder()
//                        .user(userEntity)
////                    .study(studyEntity)
//                        .studyContent(studyContent)
//                        .studyStartPoint(now)
//                        .studyEndPoint(now)
//                        .build();
//                message = "새로 시작 한 경우";
//            }
//            feedRepository.save(feedEntity);
//            log.info("FeedEntity play created: {}", feedEntity);
//
//            //        String message = userEntity.getNickname() + " 님이 " + studyContent + " 공부를 시작했습니다."; // nickname + " 님이 " + studyContent + " 공부를 시작했습니다."
//
//        }
//
//        return message;
//    }

    public String playRequest(String userIdString, String studyContent) {
        log.info("service userId: {}", userIdString);
        log.info("service studyContent: {}", studyContent);

        long userId = Long.parseLong(userIdString);
        log.info("userId string: {}", userId);

        LocalDateTime now = LocalDateTime.now();

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        UserEntity userEntity = userOptional.get();

        List<FeedEntity> userFeeds = feedRepository.findByUserUserId(userId);
        String message;

        if (!userFeeds.isEmpty()) {
            FeedEntity latestFeed = userFeeds.get(0);
            if (latestFeed.getStudyContent() != null) {
                latestFeed.setStudyStartPoint(now);
                latestFeed.setStudyEndPoint(now);
                log.info("기존의 피드도 있고 studyContent가 있는 경우");
                message = userEntity.getNickname() + "님이 다시" + studyContent + "공부를 시작했습니다.";
            } else {
                latestFeed.setStudyContent(studyContent);
                latestFeed.setStudyStartPoint(now);
                latestFeed.setStudyEndPoint(now);
                log.info("기존의 피드는 있지만 studyContent가 비어있는 경우");
                message = userEntity.getNickname() + "님이" + studyContent + "공부를 시작했습니다.";
            }
            feedRepository.save(latestFeed);
            log.info("FeedEntity play created: {}", latestFeed);
        } else {
            FeedEntity newFeed = FeedEntity.builder()
                    .user(userEntity)
//                    .study(studyEntity)
                    .studyContent(studyContent)
                    .studyStartPoint(now)
                    .studyEndPoint(now)
                    .build();
            feedRepository.save(newFeed);
            log.info("New FeedEntity created: {}", newFeed);
            log.info("기존의 피드가 없이 새로 생성 하는 경우.");
            message = userEntity.getNickname() + "님이" + studyContent + "공부를 시작했습니다.";
        }

        return message;
    }

//    public String stopRequest(String userIdString, String studyContent){
//        LocalDateTime now = LocalDateTime.now();
//
//        long userId = Long.parseLong(userIdString);
//
//        Optional<UserEntity> userOptional = userRepository.findById(userId);
//        if (userOptional.isEmpty()) {
//            throw new EntityNotFoundException("User not found");
//        }
//
//        UserEntity userEntity = userOptional.get();
//
//
//        Optional<FeedEntity> existingFeedOptional = feedRepository.findById(userId);
//        FeedEntity feedEntity;
//        if (existingFeedOptional.isPresent()) {
//            feedEntity = existingFeedOptional.get();
//            feedEntity.setStudyEndPoint(now);
//
//            LocalDateTime studyStartPoint = feedEntity.getStudyStartPoint();
//            LocalDateTime studyEndPoint = feedEntity.getStudyEndPoint();
//
//            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);
//
//            long studySeconds = studyDuration.getSeconds();
//            long studyMinutes = studySeconds/60;
//            log.info("studyEntity의 todayStudyTime으로 저장 될 시간: {}", studyMinutes , " 분");
//            Optional<StudyEntity> studyOptional = studyRepository.findById(userId);
//            if (studyOptional.isPresent()){
//                StudyEntity studyEntity = studyOptional.get();
//                long updatedStudyTime = studyEntity.getTodayStudyTime() + studyMinutes;
//                log.info("studyEntity에서 불러온 기존의 todayStudyTime: {}", studyEntity.getTodayStudyTime());
//                log.info("합산한 todayStudyTime: {}", updatedStudyTime);
//                studyEntity.setTodayStudyTime(updatedStudyTime);
//            } else {
//                log.info("studyEntity 불러오는 중 오류. todayStudyTime 저장 하지 못함.");
//            }
//
//            feedEntity.setStudyStartPoint(null);
//            feedEntity.setStudyEndPoint(null);
//            feedEntity.setStudyContent(null);
//        } else {
//            feedEntity = FeedEntity.builder()
//                    .user(userEntity)
//                    .studyContent(null)
//                    .studyStartPoint(null)
//                    .studyEndPoint(null)
//                    .build();
//        }
//
//        feedRepository.save(feedEntity);
//        log.info("FeedEntity stop created: {}", feedEntity);
//
//        String message = userEntity.getNickname() + " 님이 " + studyContent + " 공부를 마쳤습니다.";
//        return message;
//    }

    public String stopRequest(String userIdString, String studyContent) {
        LocalDateTime now = LocalDateTime.now();

        long userId = Long.parseLong(userIdString);

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        UserEntity userEntity = userOptional.get();

        // 해당 사용자에 대한 최신 피드를 가져옵니다.
        Optional<FeedEntity> existingFeedOptional = feedRepository.findLatestFeedByUserId(userId);
        if (existingFeedOptional.isPresent()) {
            FeedEntity feedEntity = existingFeedOptional.get();

            // 현재 시간을 studyEndPoint로 설정합니다.
            feedEntity.setStudyEndPoint(now);

            // 공부 시간 계산
            Duration studyDuration = Duration.between(feedEntity.getStudyStartPoint(), now);
            long studyMinutes = studyDuration.toMinutes();

            // 사용자의 공부 시간 업데이트
            Optional<StudyEntity> studyOptional = studyRepository.findByUser_UserId(userId);
            if (studyOptional.isPresent()) {
                StudyEntity studyEntity = studyOptional.get();
                long updatedStudyTime = studyEntity.getTodayStudyTime() + studyMinutes;
                studyEntity.setTodayStudyTime(updatedStudyTime);
                studyRepository.save(studyEntity); // 업데이트 저장
            } else {
                log.info("StudyEntity not found for user: {}", userId);
            }

            // 피드 초기화
            feedEntity.setStudyStartPoint(null);
            feedEntity.setStudyEndPoint(null);
            feedEntity.setStudyContent(null);

            // 피드 저장
            feedRepository.save(feedEntity);
            log.info("FeedEntity stop created: {}", feedEntity);

            String message = userEntity.getNickname() + " 님이 " + studyContent + " 공부를 마쳤습니다.";
            return message;
        } else {
            log.info("No existing feed found for user: {}", userId);

            // 새로운 피드 생성 (이 부분은 필요에 따라 처리)
            // 이 부분은 새로운 피드를 생성하는 로직입니다. 사용 사례에 따라 필요 없을 수 있습니다.
            // 새로운 피드를 생성하는 로직이 필요하지 않다면 여기에서 예외를 throw하거나 다른 처리 방법을 선택할 수 있습니다.
            // 새로운 피드를 생성하는 방법은 해당 시나리오에 맞게 작성되어야 합니다.
            return "No existing feed found for user: " + userId;
        }
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
            LocalDateTime studyEndPoint = feedEntity.getStudyEndPoint();

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
//                    .studyContent(studyContent)
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

