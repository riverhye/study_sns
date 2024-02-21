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
import studysns.server.dto.StudyDTO;
import studysns.server.service.FeedService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;
import java.util.List;

@Slf4j
@Component

public class WebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    private FeedService feedService;

    private static final ConcurrentHashMap<String, Set<WebSocketSession>> ROOMS = new ConcurrentHashMap<>();

    // --------------소켓 연결
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        try {
            String userId = extractUserIdFromSession(session);
            if (userId != null) {
                addUserToRoom(session, userId);
                log.info("added user to room");
            } else {
                log.error("failed to add user to room");
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
        log.info("failed to remove user from room");
        }catch (Exception e) {
            log.error("error while closing socket: {}", e.getMessage(), e);
        }
    }

    // ---------------- 룸 추가 및 삭제

    private void addUserToRoom(WebSocketSession session, String userId) {
        try{
        ROOMS.putIfAbsent(userId, new HashSet<>());
        ROOMS.get(userId).add(session);
        log.info("new room has been created by userId: {}", userId);
    }catch (Exception e) {
        log.error("error while creating socket room: {}", e.getMessage(), e);
    }
    }

    private void removeUserFromRoom(WebSocketSession session) {
        try{
        String userId = extractUserIdFromSession(session);
        if (ROOMS.containsKey(userId)) {
            ROOMS.get(userId).remove(session);
            log.info("user has been removed from room");
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
                    log.info("room has been successfully closed");
                } catch (IOException e) {
                    log.error("error while deleting room: {}", e.getMessage(), e);
                }
            }
        }
    }

    // ------------클라이언트에서 반환받은 토큰에서 유저아이디 추출
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
                log.info("Extracted userId from Token got back from client: {}", userId);
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
        log.info("follow information has been sent to client: {}", followJson);
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
                    log.info("new follow notification has been sent to client");
                }
            } catch (IOException e) {
                log.error("failed to send follow notification: {}", e.getMessage());
            }
        }
    }
    
    // --------------클라이언트에 피드 리스트 전송
    public void sendFeedListToClient(WebSocketSession session, List<FeedDTO> feedList) throws IOException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String feedJson = objectMapper.writeValueAsString(feedList);
            session.sendMessage(new TextMessage(feedJson));
            log.info("feed list has been sent to client");
        } catch (IOException e) {
            log.error("failed to send feed list: {}", e.getMessage());
        }
    }

    // ------------------클라이언트에 실시간 피드 알림 보내기

    public void sendFeedNotification(WebSocketSession session, String userId, String notificationMessage) {
        Set<WebSocketSession> userSessions = ROOMS.get(userId);
        if (userSessions != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            String notificationJson;
            try {
                notificationJson = objectMapper.writeValueAsString(notificationMessage);
                for (WebSocketSession userSession : userSessions) {
                    userSession.sendMessage(new TextMessage(notificationJson));
                    log.info("new feed notification has been sent to client");
                }
            } catch (IOException e) {
                log.error("failed to send feed notification: {}", e.getMessage());
            }
        }
    }

    // ----------------클라이언트에 좋아요 리스트 전송
    public void senLikeListToClient(WebSocketSession session, List<LikeDTO> likeList) throws IOException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String likeJson = objectMapper.writeValueAsString(likeList);
            session.sendMessage(new TextMessage(likeJson));
            log.info("like list has been sent to client");
        } catch (IOException e) {
            log.error("failed to send like list: {}", e.getMessage());
        }
    }

    // ------------------클라이언트에 실시간 좋아요 알림 보내기
    public void sendLikeNotification(){

    }

    public void handlePlayRequest(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
        // "pause" 메서드 호출
        StudyDTO updatedStudyDTO = feedService.playStudy(feedDTO, studyDTO);

        if (updatedStudyDTO != null) {
            String responseMessage = "Pause request success";
            sendFeedNotification(session, userId, responseMessage);
        } else {
            String errorMessage = "Failed pause request";
            sendFeedNotification(session, userId, errorMessage);
        }
    }


    // 클라이언트로부터의 stop 메시지를 처리하는 메서드
    public void handleStopRequest(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
        // "stop" 메서드 호출
        StudyDTO updatedStudyDTO = feedService.stopStudy(feedDTO, studyDTO);

        if (updatedStudyDTO != null) {
            String responseMessage = "Stop request processed successfully";
            sendFeedNotification(session, userId, responseMessage);
        } else {
            String errorMessage = "Failed to process stop request";
            sendFeedNotification(session, userId, errorMessage);
        }
    }

    // 클라이언트로부터의 pause 메시지를 처리하는 메서드
    public void handlePauseRequest(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
        // "pause" 메서드 호출
        StudyDTO updatedStudyDTO = feedService.pauseStudy(feedDTO, studyDTO);

        if (updatedStudyDTO != null) {
            String responseMessage = "Pause request processed successfully";
            sendFeedNotification(session, userId, responseMessage);
        } else {
            String errorMessage = "Failed to process pause request";
            sendFeedNotification(session, userId, errorMessage);
        }
    }


}
