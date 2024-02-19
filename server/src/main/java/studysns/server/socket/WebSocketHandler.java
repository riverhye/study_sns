package studysns.server.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import studysns.server.config.jwt.JwtProperties;
import studysns.server.dto.FeedDTO;
import studysns.server.dto.FollowDTO;
import studysns.server.dto.LikeDTO;

import java.io.IOException;
import java.util.HashSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;
import java.util.List;

@Slf4j
@Component

public class WebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private JwtProperties jwtProperties;

    private static final ConcurrentHashMap<String, Set<WebSocketSession>> ROOMS = new ConcurrentHashMap<>();

    // --------------소켓 연결
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        try {
            String userId = extractUserIdFromSession(session);
            if (userId != null) {
                addUserToRoom(session, userId);
            } else {
                log.error("Cannot find userId in session");
                session.close();
            }
        } catch (Exception e) {
            log.error("Error while opening socket: {}", e.getMessage(), e);
            session.close();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        try{
        removeUserFromRoom(session);
        }catch (Exception e) {
            log.error("error while closing socket: {}", e.getMessage(), e);
        }
    }

    // ---------------- 룸 추가 및 삭제

    private void addUserToRoom(WebSocketSession session, String userId) {
        try{
        ROOMS.putIfAbsent(userId, new HashSet<>());
        ROOMS.get(userId).add(session);
    }catch (Exception e) {
        log.error("error while creating socket room: {}", e.getMessage(), e);
    }
    }

    private void removeUserFromRoom(WebSocketSession session) {
        try{
        String userId = extractUserIdFromSession(session);
        if (ROOMS.containsKey(userId)) {
            ROOMS.get(userId).remove(session);
        }
    }catch (Exception e) {
        log.error("error while removing user from room: {}", e.getMessage(), e);
        }
    }



    public void removeRoomByUserId(String userId) {
        Set<WebSocketSession> userSession = ROOMS.remove(userId); // 해당 유조의 소켓 룸 삭제
        if (userSession != null) {
            for (WebSocketSession session : userSession) {
                try {
                    session.close(); // 해당 사용자의 모든 세션을 닫음(웹소켓 세션)
                } catch (IOException e) {
                    log.error("error while deleting room: {}", e.getMessage(), e);
                }
            }
        }
    }

    private String extractUserIdFromSession(WebSocketSession session) {
        String token = session.getHandshakeHeaders().getFirst("Authorization"); // WebSocket 세션의 헤더에서 Authorization 헤더 값을 가져옴
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // "Bearer " 부분을 제외하고 실제 토큰 값만 추출
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtProperties.getSecretKey()) // jwtProperties에서 secretKey 가져오기
                        .parseClaimsJws(token)
                        .getBody(); // 토큰의 정보가 담겨있는 바디(클레임 이라고 함)
                String userId = claims.getSubject();
                log.info("Extracted userId: {}", userId);
                return userId; // 유저의 ID 리턴. TokenProvider 에서 ID 는 페이로드에 담았음.
            } catch (Exception e) {
                log.error("Failed to parse JWT token: {}", e.getMessage());
            }
        }
        return null;
    }

    // -------------클라이언트에 팔로우한 사용자의 목록을 전송
    public void sendFollowInfoToClient(WebSocketSession session, List<FollowDTO> followList) throws IOException {
        // sendFollowInfoToClient 메소드는 WebSocketSession 과 FollowDTO 목록을 매개변수로 받음.
        try {
        ObjectMapper objectMapper = new ObjectMapper();
        // ObjectMapper 를 사용해 DTO 목록을 JSON 문자열로 변환한 다음, WebSocketSession 을 통해 클라이언트로 전송함.
        String followJson = objectMapper.writeValueAsString(followList);
        session.sendMessage(new TextMessage(followJson));
        } catch (IOException e) {
            log.error("failed to send follow information: {}", e.getMessage(), e);
        }
    }

    
    // -------------클라이언트에 실시간 알림을 표시
    public void sendFollowNotification(String userId, String notificationMessage) {
        Set<WebSocketSession> userSessions = ROOMS.get(userId);
        if (userSessions != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            String notificationJson;
            try {
                notificationJson = objectMapper.writeValueAsString(notificationMessage);
                for (WebSocketSession userSession : userSessions) {
                    userSession.sendMessage(new TextMessage(notificationJson));
                }
            } catch (IOException e) {
                log.error("failed to send follow notification: {}", e.getMessage());
            }
        }
    }
    
    // --------------클라이언트에 피드 리스트 전송
    public void sendFeedListToClient(WebSocketSession session, List<FeedDTO> feedList) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String feedJson = objectMapper.writeValueAsString(feedList);
        session.sendMessage(new TextMessage(feedJson));
    }

    // ------------------클라이언트에 실시간 피드 알림 보내기

    public void sendFeedNotification(){

    }
    
    // ----------------클라이언트에 좋아요 리스트 전송
    public void senLikeListToClient(WebSocketSession session, List<LikeDTO> likeList) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String likeJson = objectMapper.writeValueAsString(likeList);
        session.sendMessage(new TextMessage(likeJson));
    }

    // ------------------클라이언트에 실시간 좋아요 알림 보내기
    public void sendLikeNotification(){

    }

}
