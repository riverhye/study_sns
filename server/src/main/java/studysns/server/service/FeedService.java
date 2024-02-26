package studysns.server.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysns.server.dto.FeedDTO;
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
        Optional<FeedEntity> userOptional2 = feedRepository.findById(userId);

        UserEntity userEntity = userOptional.get();
        FeedEntity feedEntity = userOptional2.get();

        Optional<StudyEntity> studyOptional = studyRepository.findById(userId);
        if (studyOptional.isEmpty()) {
            throw new EntityNotFoundException("Study not found for the user");
        }
        StudyEntity studyEntity = studyOptional.get();
        Long studyId = studyEntity.getStudyId();

        List<FeedEntity> userFeeds = feedRepository.findByUserUserId(userId);
        String message;

        if (!userFeeds.isEmpty()) {
            FeedEntity latestFeed = userFeeds.get(0);
            if (latestFeed.getStudyContent() != null) {
                latestFeed.setStudyStartPoint(now);
                latestFeed.setStudyEndPoint(now);
                log.info("기존의 피드도 있고 studyContent가 있는 경우");
                message = userEntity.getNickname() + " 님이 다시 " + studyContent + " 공부를 시작했습니다.";
            } else {
                latestFeed.setStudyContent(studyContent);
                latestFeed.setStudyStartPoint(now);
                latestFeed.setStudyEndPoint(now);
                log.info("기존의 피드는 있지만 studyContent가 비어있는 경우");
                message = userEntity.getNickname() + " 님이 " + studyContent + " 공부를 시작했습니다.";
            }
            feedRepository.save(latestFeed);
            log.info("FeedEntity play created: {}", latestFeed);
        } else {
            FeedEntity newFeed = FeedEntity.builder()
                    .user(userEntity)
                    .study(studyEntity)
                    .studyContent(studyContent)
                    .studyStartPoint(now)
                    .studyEndPoint(now)
                    .build();
            feedRepository.save(newFeed);
            log.info("New FeedEntity created: {}", newFeed);
            log.info("기존의 피드가 없이 새로 생성 하는 경우.");
            message = userEntity.getNickname() + " 님이 " + studyContent + " 공부를 시작했습니다.";
        }

        JSONObject additionalData = new JSONObject();
        additionalData.put("feedId", feedEntity.getFeedId());
        additionalData.put("nickname", userEntity.getNickname());
        additionalData.put("profileImage", userEntity.getProfileImage());
        additionalData.put("date", LocalDateTime.now().toString());

        return message + additionalData.toString();
    }


    public String stopRequest(String userIdString, String studyContent) {
        LocalDateTime now = LocalDateTime.now();

        long userId = Long.parseLong(userIdString);

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        UserEntity userEntity = userOptional.get();

        Optional<FeedEntity> existingFeedOptional = feedRepository.findLatestFeedByUserId(userId);
        if (existingFeedOptional.isPresent()) {
            FeedEntity feedEntity = existingFeedOptional.get();

            feedEntity.setStudyEndPoint(now);

            Duration studyDuration = Duration.between(feedEntity.getStudyStartPoint(), now);
            long studyMinutes = studyDuration.toMinutes();

            Optional<StudyEntity> studyOptional = studyRepository.findByUser_UserId(userId);
            if (studyOptional.isPresent()) {
                StudyEntity studyEntity = studyOptional.get();
                long updatedStudyTime = studyEntity.getTodayStudyTime() + studyMinutes;
                studyEntity.setTodayStudyTime(updatedStudyTime);
                studyRepository.save(studyEntity); // 업데이트 저장
            } else {
                log.info("StudyEntity not found for user: {}", userId);
            }

            feedEntity.setStudyStartPoint(null);
            feedEntity.setStudyEndPoint(null);

            feedEntity.setStudyContent(null);

            feedRepository.save(feedEntity);
            log.info("FeedEntity stop created: {}", feedEntity);

            String message = userEntity.getNickname() + " 님이 공부를 마쳤습니다.";

            JSONObject additionalData = new JSONObject();
            additionalData.put("feedId", feedEntity.getFeedId());
            additionalData.put("nickname", userEntity.getNickname());
            additionalData.put("profileImage", userEntity.getProfileImage());
            additionalData.put("date", LocalDateTime.now().toString());

            return message + additionalData.toString();

        } else {
            log.info("No existing feed found for user: {}", userId);
            return "No existing feed found for user: " + userId;
        }
    }


    public String pauseRequest(String userIdString, String studyContent) {
        LocalDateTime now = LocalDateTime.now();

        long userId = Long.parseLong(userIdString);

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        UserEntity userEntity = userOptional.get();

        Optional<FeedEntity> existingFeedOptional = feedRepository.findLatestFeedByUserId(userId);
        if (existingFeedOptional.isPresent()) {
            FeedEntity feedEntity = existingFeedOptional.get();

            feedEntity.setStudyEndPoint(now);

            Duration studyDuration = Duration.between(feedEntity.getStudyStartPoint(), now);
            long studyMinutes = studyDuration.toMinutes();

            Optional<StudyEntity> studyOptional = studyRepository.findByUser_UserId(userId);
            if (studyOptional.isPresent()) {
                StudyEntity studyEntity = studyOptional.get();
                long updatedStudyTime = studyEntity.getTodayStudyTime() + studyMinutes;
                studyEntity.setTodayStudyTime(updatedStudyTime);
                studyRepository.save(studyEntity); // 업데이트 저장
            } else {
                log.info("StudyEntity not found for user: {}", userId);
            }

            feedEntity.setStudyStartPoint(null);
            feedEntity.setStudyEndPoint(null);


            feedRepository.save(feedEntity);
            log.info("FeedEntity pause created: {}", feedEntity);

            String message = userEntity.getNickname() + " 님이 잠시 휴식 중입니다.";

            return message;


        } else {
            log.info("No existing feed found for user: {}", userId);
            return "No existing feed found for user: " + userId;
        }
    }
    }

