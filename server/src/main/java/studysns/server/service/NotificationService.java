package studysns.server.service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import studysns.server.entity.UserEntity;
import studysns.server.repository.UserRepository;

@Service
public class NotificationService {
    private final UserRepository userRepository;

    @Autowired
    public NotificationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ------------------실시간 팔로우----------------
    // 너무 헷갈림. 토큰의 userId의 사용자를 팔로우 한게 followId임. 그럼 그 followId를 가진 유저의 닉네임을 찾아야 하는데, 그러려면 user 테이블에서 해당 followId를 가진 유저의 userId를 찾아서 nickname 을
    // 반환해야함. 어케함?..
    public void sendFollowNotification(long userId, long followId) {
        // followId로 유저의 닉네임 찾기
        UserEntity follower = userRepository.findById(followId)
                .orElseThrow(() -> new EntityNotFoundException("팔로워를 찾지 못함"));

        // 닉네임 + 메세지를 클라이언트로 전송
        String message = follower.getNickname() + "님이 회원님을 팔로우 했습니다.";
        System.out.println(message);
    } // 클라이언트에서 받는 데이터는 JSON.parse() 로 사용가능하다고 함. 소켓 연결 확인 후 테스트 해볼예정.

    // ------------------실시간 피드----------------
    
    public void sendFeedNotification(){

    }

    // ------------------실시간 좋아요----------------
    
    public void sendLikeNotification(){

    }

}
