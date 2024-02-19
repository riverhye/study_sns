package studysns.server.service;


import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysns.server.dto.FollowDTO;
import studysns.server.entity.FollowEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.FollowRepository;
import studysns.server.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    private final NotificationService notificationService;


    @Autowired
    public FollowService(FollowRepository followRepository, UserRepository userRepository, NotificationService notificationService){
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public void addFollow(FollowDTO followDTO){
        UserEntity userEntity = userRepository.findById(followDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found")); // postman 으로 테스트 해본다고 추가. 클라이언트 연결 후 삭제.

        FollowEntity followEntity = FollowEntity.builder()
                .followId(followDTO.getFollowId())
                .user(userEntity)
                .build();

        followRepository.save(followEntity);

        notificationService.sendFollowNotification(userEntity.getUserId(), followDTO.getFollowId());

    }

    public List<FollowDTO> getFollowByUserId(long userId) {
        // userId 기반, 해당 유저의 팔로워 조회
        List<FollowEntity> followEntities = followRepository.findByUserUserId(userId);
        
        // 조회한 팔로워 정보를 FollowDTO 로 변환하여 반환
        List<FollowDTO> followDTOList = new ArrayList<>();
        for (FollowEntity entity : followEntities) {
            FollowDTO dto = FollowDTO.builder()
                    .followerId(entity.getFollowerId())
                    .followId(entity.getFollowId())
                    .userId(entity.getUser().getUserId())
                    .build();
            followDTOList.add(dto);
        }
        return followDTOList;
    }
}