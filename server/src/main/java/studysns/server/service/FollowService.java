package studysns.server.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import studysns.server.dto.AllStudyInfoDTO;

import org.springframework.transaction.annotation.Transactional;

import studysns.server.dto.FollowDTO;
import studysns.server.entity.FollowEntity;
import studysns.server.entity.StudyEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.FollowRepository;
import studysns.server.repository.StudyRepository;
import studysns.server.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public List<FollowDTO> getFollowByUserId(long userId) {
        // userId 기반, 해당 유저의 팔로워 조회
        List<FollowEntity> followEntities = followRepository.findByUser_UserId(userId);

        // 조회한 팔로워 정보를 FollowDTO 로 변환하여 반환
        List<FollowDTO> followDTOList = new ArrayList<>();
        for (FollowEntity entity : followEntities) {
            FollowDTO dto = FollowDTO.builder()
                    .followerId(entity.getFollowerId())
                    .followId(entity.getUserFollow().getUserId())
                    .userId(entity.getUser().getUserId())
                    .build();
            followDTOList.add(dto);
        }
        return followDTOList;
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

//    public String followRequest(String userId, String targetNickname) {
//        String message;
//        // 1. userId로 팔로우를 요청한 유저 정보 가져오기
//        Long userIdLong = Long.parseLong(userId);
//        UserEntity follower = userRepository.findById(userIdLong)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // 2. targetNickname으로 팔로우 대상 유저 정보 가져오기
//        UserEntity targetUser = userRepository.findByNickname(targetNickname);
//        if (targetUser == null) {
//            throw new RuntimeException("Target user not found");
//        }
//
//        // 3. FollowEntity에 정보 저장
//        FollowEntity follow = FollowEntity.builder()
//                .user(follower) // 팔로우 요청을 보낸 유저
//                .followingId(targetUser.getUserId())  // 팔로우 대상 유저의 아이디
//                .followTime(LocalDateTime.now())
//                .build();
//
//        followRepository.save(follow);
//
//        message = targetNickname + "님이 회원님을 팔로우 했습니다.";
//
//        return message;
//    }


}