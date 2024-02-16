package studysns.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysns.server.dto.LikeDTO;
import studysns.server.entity.FeedEntity;
import studysns.server.entity.LikeEntity;
import studysns.server.entity.UserEntity;
import studysns.server.repository.FeedRepository;
import studysns.server.repository.LikeRepository;
import studysns.server.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service

public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final FeedRepository feedRepository;

    @Autowired
    public LikeService(LikeRepository likeRepository, UserRepository userRepository, FeedRepository feedRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.feedRepository = feedRepository;
    }

    public void addLike(LikeDTO likeDTO) {
        UserEntity userEntity = userRepository.findById(likeDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        FeedEntity feedEntity = feedRepository.findById(likeDTO.getFeedId())
                .orElseThrow(() -> new IllegalArgumentException("Feed not found"));

        LikeEntity likeEntity = LikeEntity.builder()
                .user(userEntity)
                .feed(feedEntity)
                .build();

        likeRepository.save(likeEntity);
    }

    public List<LikeDTO> getLikesByUserId(long userId) {
        List<LikeEntity> likeEntities = likeRepository.findByUserUserId(userId);
        List<LikeDTO> likeDTOList = new ArrayList<>();
        for (LikeEntity likeEntity : likeEntities) {
            LikeDTO likeDTO = LikeDTO.builder()
                    .likeId(likeEntity.getLikeId())
                    .userId(likeEntity.getUser().getUserId())
                    .feedId(likeEntity.getFeed().getFeedId())
                    .build();
            likeDTOList.add(likeDTO);
        }
        return likeDTOList;
    }
}


