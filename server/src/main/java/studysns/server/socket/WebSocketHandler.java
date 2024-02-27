package studysns.server.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.core.type.TypeReference;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
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
import studysns.server.entity.FeedEntity;
import studysns.server.entity.StudyEntity;
import studysns.server.entity.UserEntity;
import studysns.server.service.FeedService;
import studysns.server.service.FollowService;
import studysns.server.service.LikeService;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component

public class WebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private JwtProperties jwtProperties;

    @Autowired
    private FeedService feedService;

    @Autowired
    private FollowService followService;

    @Autowired
    private LikeService likeService;


    private static final ConcurrentHashMap<String, Set<WebSocketSession>> ROOMS = new ConcurrentHashMap<>();

    private String extractUserIdFromSession(WebSocketSession session) {
        String token = session.getUri().getQuery().substring(6);
//        String token = session.getHandshakeHeaders().getFirst("Sec-WebSocket-Protocol");
        log.warn("extractUserIdFromSession: token extracted: {}", token);
        if (token != null) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtProperties.getSecretKey())
                        .parseClaimsJws(token)
                        .getBody(); // 토큰의 정보가 담겨있는 바디(클레임 이라고 함)
                String userId = claims.getSubject();
                String nickname = claims.get("nickname", String.class);
                log.info("Extracted userId: {}", userId);
//                log.info("Extracted nickname: {}", nickname);
                return userId; // 유저의 ID 리턴. TokenProvider 에서 ID 는 페이로드에 담았음.
            } catch (Exception e) {
                log.error("Failed to parse JWT token: {}", e.getMessage());
            }
        }
        return null;
    }


    private void addUserToRoom(WebSocketSession session, String userId) {
        try{
            ROOMS.putIfAbsent(userId, new HashSet<>());
            ROOMS.get(userId).add(session);
            log.info("addUserToRoom: new room has been created by userId: {}", userId);
        }catch (Exception e) {
            log.error("addUserToRoom: error while creating socket room: {}", e.getMessage(), e);
        }
    }
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        try {
            String userId = extractUserIdFromSession(session);
            if (userId != null) {
                addUserToRoom(session, userId);
                log.info("afterConnectionEstablished: added user to room: {}", userId);
            } else {
                log.error("afterConnectionEstablished: failed to add user to room");
                session.close();
            }
        } catch (Exception e) {
            log.error("afterConnectionEstablished: Error while opening socket: {}", e.getMessage(), e);
            session.close();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        try {
//            String token = session.getHandshakeHeaders().getFirst("Sec-WebSocket-Protocol");
            String token = session.getUri().getQuery().substring(6);

            if (token != null && isValidToken(token)) {
                log.info("afterConnectionClosed: Token is valid but socket has been closed. Removing room");
                removeRoomByUserId(extractUserIdFromSession(session));
            } else {
                log.info("afterConnectionClosed: Token is invalid or missing. Removing room.");
                removeRoomByUserId(extractUserIdFromSession(session));
            }
        } catch (Exception e) {
            log.error("afterConnectionClosed: Error while closing socket: {}", e.getMessage(), e);
        }
    }

    public void removeRoomByUserId(String userId) {
        Set<WebSocketSession> userSessions = ROOMS.remove(userId); // 해당 유저의 세션 목록을 가져옴
        if (userSessions != null) {
            for (WebSocketSession session : userSessions) {
                try {
                    session.close(); // 해당 유저의 세션을 닫음
                    log.info("removeRoomByUserId: WebSocket session has been successfully closed");
                } catch (IOException e) {
                    log.error("removeRoomByUserId: Error while closing WebSocket session: {}", e.getMessage(), e);
                }
            }
            log.info("removeRoomByUserId: All users have been removed from the room");
        } else {
            log.info("removeRoomByUserId: No users found in the room");
        }
    }


    private boolean isValidToken(String token) {
        try {
            // Attempt to parse the token without throwing an exception
            Jwts.parser()
                    .setSigningKey(jwtProperties.getSecretKey())
                    .parseClaimsJws(token);
            return true; // Token is valid
        } catch (Exception e) {
            return false; // Token is invalid
        }
    }




    // -------------클라이언트에 팔로우한 사용자의 목록을 전송
//    public void sendFollowInfoToClient(WebSocketSession session, List<FollowDTO> followList) throws IOException {
//        // sendFollowInfoToClient 메소드는 WebSocketSession 과 FollowDTO 목록을 매개변수로 받음.
//        try {
//        ObjectMapper objectMapper = new ObjectMapper();
//        // ObjectMapper 를 사용해 DTO 목록을 JSON 문자열로 변환한 다음, WebSocketSession 을 통해 클라이언트로 전송함.
//        String followJson = objectMapper.writeValueAsString(followList);
//        session.sendMessage(new TextMessage(followJson));
//        log.info("follow information has been sent to client: {}", followJson);
//        } catch (IOException e) {
//            log.error("failed to send follow information: {}", e.getMessage(), e);
//        }
//    }


    // -------------클라이언트에 실시간 알림을 표시
//    public void sendFollowNotification(String userId) {
//        Set<WebSocketSession> userSessions = ROOMS.get(userId);
//
//    }

    // --------------클라이언트에 피드 리스트 전송
//    public void sendFeedListToClient(WebSocketSession session, List<FeedDTO> feedList) throws IOException {
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//            String feedJson = objectMapper.writeValueAsString(feedList);
//            session.sendMessage(new TextMessage(feedJson));
//            log.info("feed list has been sent to client");
//        } catch (IOException e) {
//            log.error("failed to send feed list: {}", e.getMessage());
//        }
//    }

    // ------------------클라이언트에 실시간 피드 알림 보내기

//    public void sendFeedNotification(WebSocketSession session, String userId, String notificationMessage) {
//        Set<WebSocketSession> userSessions = ROOMS.get(userId);
//        if (userSessions != null) {
//            ObjectMapper objectMapper = new ObjectMapper();
//            String notificationJson;
//            try {
//                notificationJson = objectMapper.writeValueAsString(notificationMessage);
//                for (WebSocketSession userSession : userSessions) {
//                    userSession.sendMessage(new TextMessage(notificationJson));
//                    log.info("new feed notification has been sent to client");
//                }
//            } catch (IOException e) {
//                log.error("failed to send feed notification: {}", e.getMessage());
//            }
//        }
//    }

    // ----------------클라이언트에 좋아요 리스트 전송
//    public void senLikeListToClient(WebSocketSession session, List<LikeDTO> likeList) throws IOException {
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//            String likeJson = objectMapper.writeValueAsString(likeList);
//            session.sendMessage(new TextMessage(likeJson));
//            log.info("like list has been sent to client");
//        } catch (IOException e) {
//            log.error("failed to send like list: {}", e.getMessage());
//        }
//    }

    // ------------------클라이언트에 실시간 좋아요 알림 보내기
//    public void sendLikeNotification(){
//
//    }

    private String userId;
    private String studyContent;

    private String targetNickname;

    private String feedId;
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String token = session.getUri().getQuery().substring(6);
        if (token != null) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtProperties.getSecretKey())
                        .parseClaimsJws(token)
                        .getBody();
                userId = claims.get("sub", String.class);
            } catch (Exception e) {
                log.error("Failed to parse JWT token: {}", e.getMessage());
            }
        }
        String payload = message.getPayload();

        ObjectMapper objectMapper = new ObjectMapper();

        Map<String, String> jsonMap = objectMapper.readValue(payload, new TypeReference<Map<String, String>>() {});

        String action = jsonMap.get("action");

        studyContent = jsonMap.get("studyContent");

//        targetNickname = jsonMap.get("targetNickname");
        targetNickname = "user_ad98ba4c";

//        nickname = jsonMap.get("nickname");

        if ("play".equals(action)) {
            log.info("received action: {}", action);
            log.info("studyContent received: {}", studyContent);
            String playMessageWithAdditionalData = feedService.playRequest(userId, studyContent);

            JSONObject messageObject = new JSONObject();
            messageObject.put("type", "play");
            messageObject.put("message", playMessageWithAdditionalData);
            session.sendMessage(new TextMessage(messageObject.toString()));
            log.info("message to client: {}", messageObject.toString());
        }
        else if ("stop".equals(action)) {
            log.info("received action: {}", action);
            String stopMessageWithAdditionalData = feedService.stopRequest(userId, studyContent);

            JSONObject messageObject = new JSONObject();
            messageObject.put("type", "stop");
            messageObject.put("message", stopMessageWithAdditionalData);
            session.sendMessage(new TextMessage(messageObject.toString()));
            log.info("message to client: {}", messageObject.toString());
        }
        else if ("pause".equals(action)) {
            log.info("received action: {}", action);
            String pauseMessage = feedService.pauseRequest(userId, studyContent);

            String messageWithType = "pause: " + pauseMessage;
            session.sendMessage(new TextMessage(messageWithType));
            log.info("message to client: {}", messageWithType);
        }
        else if ("rank".equals(action)) {
            List<Map<String, Object>> userInfos = followService.rankRequest();

            JSONArray jsonArray = new JSONArray();
            for (Map<String, Object> userInfo : userInfos) {
                JSONObject userObject = new JSONObject();
                userObject.put("nickname", userInfo.get("nickname"));
                userObject.put("todayStudyTime", userInfo.get("todayStudyTime"));
                userObject.put("profileImage", userInfo.get("profileImage"));
                jsonArray.add(userObject);
            }

            String messageRank = "rank: " + jsonArray.toJSONString();
            log.info("rank send info: {}", messageRank);
            session.sendMessage(new TextMessage(messageRank));
        }
        else if ("follow".equals(action)){
            String followMessage = followService.followRequest(userId, targetNickname);
//            log.info("핸들러 userid: {}", userId);
//            log.info("핸들러 타겟 닉네임: {}", targetNickname);

            String messageWithType = "follow: " + followMessage;
            session.sendMessage(new TextMessage(messageWithType));
            log.info("follow message sent to client: {}", messageWithType);
        }
        else if ("like".equals(action)) {
            log.info("received action: {}", action);

//            String feedId = jsonMap.get("feedId");
            String feedId = "2";

            String likeData = likeService.likeFeed(userId, feedId);

            JSONObject messageObject = new JSONObject();
            messageObject.put("type", "like");
            messageObject.put("message", likeData);
            session.sendMessage(new TextMessage(messageObject.toString()));
            log.info("message to client: {}", messageObject.toString());
        }
        else if ("unlike".equals(action)) {
            log.info("received action: {}", action);

            //            String feedId = jsonMap.get("feedId");
            String feedId = "2";

            String unlikeData = likeService.unlikeFeed(userId, feedId);

            JSONObject messageObject = new JSONObject();
            messageObject.put("type", "unlike");
            messageObject.put("message", unlikeData);
            session.sendMessage(new TextMessage(messageObject.toString()));
            log.info("message to client: {}", messageObject.toString());
        }
        else {
            log.warn("Unknown action: {}", action);
        }
    }




//    public void sendMessageToClient(WebSocketSession session, String message) {
//        try {
//            session.sendMessage(new TextMessage(message));
//            log.info("Message sent: {}", message);
//        } catch (IOException e) {
//            log.error("Failed to send message: {}", e.getMessage(), e);
//        }
//    }
}