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

    @Autowired
    public FollowService(FollowRepository followRepository, UserRepository userRepository){
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    public void addFollow(FollowDTO followDTO){
        UserEntity userEntity = userRepository.findById(followDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found")); // postman 으로 테스트 해본다고 추가. 클라이언트 연결 후 삭제.

        FollowEntity followEntity = FollowEntity.builder()
                .followId(followDTO.getFollowId())
                .userEntity(userEntity)
                .build();

        followRepository.save(followEntity);
    }

    public List<FollowDTO> getFollowByFollowerId(long followerId) {
        List<FollowEntity> followEntities = followRepository.findByFollowerId(followerId);
        List<FollowDTO> followDTOList = new ArrayList<>();
        for (FollowEntity entity : followEntities) {
            FollowDTO dto = FollowDTO.builder()
                    .followerId(entity.getFollowerId())
                    .followId(entity.getFollowId())
                    .userId(entity.getUserEntity().getUserId())
                    .build();
            followDTOList.add(dto);
        }
        return followDTOList;
    }
}