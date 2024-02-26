package studysns.server.service;


import jakarta.persistence.EntityNotFoundException;
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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
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



    public AllStudyInfoDTO.User getFollowInfo(long userId) {
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
    public List<String> rankRequest() {
        List<StudyEntity> topUsers = studyRepository.findTop10ByOrderByTodayStudyTimeDesc();

        List<String> nicknames = topUsers.stream()
                .map(userEntity -> userRepository.findNicknameByUserId(userEntity.getUser().getUserId()))
                .collect(Collectors.toList());

        return nicknames;
    }





}