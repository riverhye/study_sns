package studysns.server.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.antlr.v4.runtime.Token;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import studysns.server.dto.AllStudyInfoDTO;

import org.springframework.transaction.annotation.Transactional;

import studysns.server.dto.FollowCountDTO;
import studysns.server.dto.FollowDTO;
import studysns.server.entity.FollowEntity;
import studysns.server.entity.StudyEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.FollowRepository;
import studysns.server.repository.StudyRepository;
import studysns.server.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FollowService {
    @Autowired
    private final FollowRepository followRepository;
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final StudyRepository studyRepository;

    private final NotificationService notificationService;


    @Autowired
    public FollowService(FollowRepository followRepository, UserRepository userRepository, NotificationService notificationService, StudyRepository studyRepository){
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.studyRepository = studyRepository;
    }

    public void addFollow(FollowDTO followDTO){
        UserEntity userEntity = userRepository.findById(followDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found")); // postman 으로 테스트 해본다고 추가. 클라이언트 연결 후 삭제.

        UserEntity userFollowEntity = userRepository.findById(followDTO.getFollowerId())
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        FollowEntity followEntity = FollowEntity.builder()
                .userFollow(userFollowEntity)
                .user(userEntity)
                .build();

        followRepository.save(followEntity);

        notificationService.sendFollowNotification(userEntity.getUserId(), followDTO.getFollowId());

    }

    public List<FollowCountDTO> getFollowByUserId(long userId) {
        Long followerCount = followRepository.countByUserUserId(userId);
        Long followingCount = followRepository.countByUserFollowUserId(userId);

        List<FollowCountDTO> followCountDTOList = new ArrayList<>();
        FollowCountDTO dto = FollowCountDTO.builder()
                .followerCount(followerCount)
                .followingCount(followingCount)
                .build();
        followCountDTOList.add(dto);
        return followCountDTOList;

    }





    public AllStudyInfoDTO.User getFollowInfo(Long userId) {
        UserEntity user = userRepository.findByUserId(userId);

        Long following = followRepository.countByUser_userId(userId);

        Long follower = followRepository.countByUserFollowUserId(userId);

        AllStudyInfoDTO.User userFollowInfo = AllStudyInfoDTO.User.builder()
                .nickname(user.getNickname())
                .email(user.getEmail())
                .followingId(follower)
                .followerId(following)
                .userimage(user.getProfileImage())  // userimage 추가
                .build();
        return userFollowInfo;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> rankRequest() {
        List<StudyEntity> topUsers = studyRepository.findTop10ByOrderByTodayStudyTimeDesc();

        List<Map<String, Object>> userInfos = topUsers.stream()
                .map(studyEntity -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    UserEntity userEntity = studyEntity.getUser();
                    String nickname = userRepository.findNicknameByUserId(userEntity.getUserId());
                    long todayStudyTime = studyEntity.getTodayStudyTime();
                    String profileImage = userEntity.getProfileImage();

                    userInfo.put("nickname", nickname);
//                    log.info("nickname from followService: {}", nickname);
                    userInfo.put("todayStudyTime", todayStudyTime);
//                    log.info("studyTime from followService: {}", todayStudyTime);
                    userInfo.put("profileImage", profileImage);

                    return userInfo;
                })
                .collect(Collectors.toList());
//        log.info("total value: {}", userInfos);
        return userInfos;
    }

    public JSONObject followRequest(String userId, String targetNickname) {
        String message;
        Long userIdLong = Long.parseLong(userId);

        Optional<FollowEntity> userOptional = followRepository.findById(userIdLong);
        if (userOptional.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        FollowEntity followEntity = userOptional.get();

        Optional<UserEntity> userOptional2 = userRepository.findById(userIdLong);
        if (userOptional2.isEmpty()) {
            throw new EntityNotFoundException("User not found");
        }

        UserEntity userEntity = userOptional2.get();

        UserEntity TokenUser = userRepository.findById(userIdLong)
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info("현재 토큰의 유저 ID: {}", TokenUser.getUserId());

        UserEntity targetUser = userRepository.findByNickname(targetNickname);
        if (targetUser == null) {
            throw new RuntimeException("Target user not found");
        }
        log.info("내가 팔로우 한 유저의 ID: {}", targetUser.getUserId());

        FollowEntity follow = FollowEntity.builder()
                .user(targetUser) // 팔로우 요청을 한 유저 (현재 토큰의 유저)
                .userFollow(TokenUser)// 내가 팔로우 한 유저
                .followTime(LocalDateTime.now())
                .build();

        followRepository.save(follow);
        message = targetNickname + " 님을 팔로우 했습니다.";

        JSONObject additionalData = new JSONObject();
        additionalData.put("feedId", followEntity.getFollowerId());
        additionalData.put("profileImage", userEntity.getProfileImage());
        additionalData.put("date", LocalDateTime.now().toString());
        additionalData.put("nickname", targetNickname);
        additionalData.put("message", message);



        return additionalData;
    }


}