package studysns.server.service;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
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
@Slf4j

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

    public String likeFeed(String userId, String feedId) {
        long parsedUserId = Long.parseLong(userId);
        UserEntity existingUser = userRepository.findByUserId(parsedUserId);

        String message;

        if (existingUser == null) {
            throw new IllegalArgumentException("User not found");
        }

        FeedEntity feed = feedRepository.findById(Long.parseLong(feedId)).orElse(null);
        if (feed == null) {
            throw new IllegalArgumentException("Feed not found");
        }

        // 이미 좋아요가 있는지 확인
        LikeEntity existingLike = likeRepository.findByUserAndFeed(existingUser, feed);
        if (existingLike != null) {
            // 이미 좋아요가 있으므로 추가하지 않음
            return message = "이미 좋아요를 눌렀습니다.";
        }

        // 좋아요 엔터티 생성
        LikeEntity like = LikeEntity.builder()
                .user(existingUser)
                .feed(feed)
                .isLiked(true)
                .build();

        likeRepository.save(like);

        message = "좋아요를 눌렀습니다.";

        boolean isLiked = like.isLiked();
        long returnedFeedId = feed.getFeedId();

        JSONObject Data = new JSONObject();
        Data.put("isLiked", isLiked);
        Data.put("feedId", returnedFeedId);

        return message + Data;
    }



    public String unlikeFeed(String userId, String feedId) {
        long parsedUserId = Long.parseLong(userId);
        UserEntity user = userRepository.findByUserId(parsedUserId);
        FeedEntity feed = feedRepository.findById(Long.parseLong(feedId)).orElse(null);

        String message;

        if (user == null || feed == null) {
            throw new IllegalArgumentException("User or feed not found");
        }

        LikeEntity like = likeRepository.findByUserAndFeed(user, feed);
        if (like != null) {
            likeRepository.delete(like);

            message = "좋아요를 취소 했습니다.";

        } else {
            message = "이미 좋아요를 취소했습니다.";
        }

        boolean isLiked = false;

        long returnedFeedId = feed.getFeedId();

        JSONObject Data = new JSONObject();
        Data.put("isLiked", isLiked);
        Data.put("feedId", returnedFeedId);

        return message + Data;
    }

}


