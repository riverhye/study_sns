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

    private static final ConcurrentHashMap<String, Set<WebSocketSession>> ROOMS = new ConcurrentHashMap<>();

    // ------------클라이언트에서 반환받은 토큰에서 유저아이디 추출
    private String extractUserIdFromSession(WebSocketSession session) {
        String token = session.getHandshakeHeaders().getFirst("Sec-WebSocket-Protocol"); // <--- 병진님 여기 부분 바뀌었어요 WebSocket 세션 헤더 대신
        log.warn("extractUserIdFromSession: token extracted: {}",token);
//        if (token != null && token.startsWith("Bearer ")) { // 기존 코드 주석 처리
        if (token != null) { // 이걸로 바꿈
//            token = token.substring(7); // "Bearer " 부분을 제외하고 실제 토큰 값만 추출
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtProperties.getSecretKey()) // jwtProperties에서 secretKey 가져오기
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

    // --------------소켓 연결
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
            String token = session.getHandshakeHeaders().getFirst("Sec-WebSocket-Protocol");

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



    // ---------------- 룸 추가 및 삭제

    private void addUserToRoom(WebSocketSession session, String userId) {
        try{
        ROOMS.putIfAbsent(userId, new HashSet<>());
        ROOMS.get(userId).add(session);
        log.info("addUserToRoom: new room has been created by userId: {}", userId);
    }catch (Exception e) {
        log.error("addUserToRoom: error while creating socket room: {}", e.getMessage(), e);
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


    // Method to validate the token
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

    // -------------------피드 관련 메소드

    // **************클라이언트에서 play,pause,stop 메소드를 요청하는 방법**************
    // play 의 경우를 예시로 action = 'play' 로 요청을 보냅니다.
    // 예를들어
    // const requestMessageFromClient = { action: 'play'};
    //   socket.send(JSON.stringify(requestMessageFromClient));
    // 와 같은 방법으로 하면됩니다.

    // 클라이언트로부터의 play 메시지를 처리하는 메서드
    // 클라이언트가 feedDTO 요청을 보낼때 studyContent 가 null 이 아니여야 함. 기존에 등록한 콘텐츠가 존재 한다던지 play 요청을 보낼때 새롭게 등록을 해줘야 함.
    public void handlePlayRequest(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO, String studyContent) {
        String studyMessage = playStudy(session, feedDTO, studyDTO, userId, studyContent);

        // 반환된 메시지를 사용하여 클라이언트로 메시지 전송
        if (studyMessage != null) {
            sendFeedNotification(session, userId, studyMessage);
        } else {
            // 실패한 경우에 대한 처리
            String errorMessage = "공부 시작 실패";
            try {
                sendErrorMessageToClient(session, errorMessage);
            } catch (IOException e) {
                // 클라이언트에게 에러 메시지를 보낼 수 없는 경우에 대한 예외 처리
                log.error("Failed to send error message to client: {}", e.getMessage(), e);
            }
        }
    }

    // 클라이언트에게 에러 메시지를 보내는 메소드
    private void sendErrorMessageToClient(WebSocketSession session, String errorMessage) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String errorJson = objectMapper.writeValueAsString(errorMessage);
        session.sendMessage(new TextMessage(errorJson));
        log.info("Error message has been sent to client: {}", errorMessage);
    }




    // 클라이언트로부터의 stop 메시지를 처리하는 메서드
    public void handleStopRequest(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
        stopStudy(session, userId, feedDTO, studyDTO);
    }

    // 클라이언트로부터의 pause 메시지를 처리하는 메서드
    public void handlePauseRequest(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
        pauseStudy(session, userId, feedDTO, studyDTO);
    }
    public String playStudy(WebSocketSession session, FeedDTO feedDTO, StudyDTO studyDTO, String userId, String studyContent) {
        LocalDateTime now = LocalDateTime.now(); // 현재 시간

        String nickname = null;

        // 클레임에서 닉네임을 추출
        String token = session.getHandshakeHeaders().getFirst("Sec-WebSocket-Protocol");
        if (token != null) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtProperties.getSecretKey())
                        .parseClaimsJws(token)
                        .getBody();
                nickname = claims.get("nickname", String.class);
            } catch (Exception e) {
                log.error("Failed to parse JWT token: {}", e.getMessage());
            }
        }

        // 일시 정지 했다가 다시 시작하는 경우
        if (feedDTO.getStudyStartPoint() != null) {
            // 기존의 기록을 삭제하고 새로운 기록을 시작
            feedDTO.setStudyStartPoint(now);
            feedDTO.setStudyEndPoint(now);

            // 매 초마다 studyEndPoint 를 업데이트하는 스케줄러 시작
            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
            scheduler.scheduleAtFixedRate(() -> {
                LocalDateTime studyEndPoint = LocalDateTime.now();
                feedDTO.setStudyEndPoint(studyEndPoint);
            }, 0, 5, TimeUnit.SECONDS); // 5초마다 추가된 시간이 EndPoint로 업데이트 | 테스트 과정에서 확인하기 편하도록 초로 설정했음. ***********배포시 꼭 변경***************

            return nickname + " 님이 다시 " + studyContent + "공부를 시작했습니다."; // 클라이언트에게 전송할 메시지 반환

        } else {
            // 정지 또는 처음 시작을 하는 경우
            feedDTO.setStudyStartPoint(now);
            feedDTO.setStudyEndPoint(now);

            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
            scheduler.scheduleAtFixedRate(() -> {
                LocalDateTime studyEndPoint = LocalDateTime.now();
                feedDTO.setStudyEndPoint(studyEndPoint);
            }, 0, 5, TimeUnit.SECONDS);

            return nickname + " 님이 " + studyContent + "공부를 시작했습니다."; // 클라이언트에게 전송할 메시지 반환
        }
    }


    public void stopStudy(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
        LocalDateTime studyStartPoint = feedDTO.getStudyStartPoint();
        LocalDateTime studyEndPoint = LocalDateTime.now();

        String nickname = null;

        // 클레임에서 닉네임을 추출
        String token = session.getHandshakeHeaders().getFirst("Sec-WebSocket-Protocol");
        if (token != null) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtProperties.getSecretKey())
                        .parseClaimsJws(token)
                        .getBody();
                nickname = claims.get("nickname", String.class);
            } catch (Exception e) {
                log.error("Failed to parse JWT token: {}", e.getMessage());
            }
        }

        if (studyStartPoint != null) {
            // Calculate study duration in seconds
            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);
            long studySeconds = studyDuration.getSeconds();

            // Convert study duration to minutes
            long studyMinutes = studySeconds / 60;

            // Update todayStudyTime in studyDTO
            long updatedStudyTime = studyDTO.getTodayStudyTime() + studyMinutes;
            studyDTO.setTodayStudyTime(updatedStudyTime);

            // Delete studyStartPoint and studyEndPoint from feedDTO
            feedDTO.setStudyStartPoint(null);
            feedDTO.setStudyEndPoint(null);

            // 전송할 메시지 생성
            String message = nickname + "님이 공부를 마쳤습니다.";

            // 클라이언트에게 메시지 전송
            sendFeedNotification(session, userId, message);
        } else {
            String errorMessage = "Failed to process stop request";
            sendFeedNotification(session, userId, errorMessage);
        }
    }

    public void pauseStudy(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
        LocalDateTime studyStartPoint = feedDTO.getStudyStartPoint();
        LocalDateTime studyEndPoint = LocalDateTime.now();

        String nickname = null;

        // 클레임에서 닉네임을 추출
        String token = session.getHandshakeHeaders().getFirst("Sec-WebSocket-Protocol");
        if (token != null) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtProperties.getSecretKey())
                        .parseClaimsJws(token)
                        .getBody();
                nickname = claims.get("nickname", String.class);
            } catch (Exception e) {
                log.error("Failed to parse JWT token: {}", e.getMessage());
            }
        }

        if (studyStartPoint != null) {
            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);
            long studySeconds = studyDuration.getSeconds();

            long studyMinutes = studySeconds / 60;

            long updatedStudyTime = studyDTO.getTodayStudyTime() + studyMinutes;
            studyDTO.setTodayStudyTime(updatedStudyTime);

            // 여기에서는 일단 휴식중인 시간이 기록됨
            if (studyStartPoint != null) {
                feedDTO.setStudyStartPoint(null);
                feedDTO.setStudyEndPoint(null);

                LocalDateTime now = LocalDateTime.now();

                feedDTO.setStudyStartPoint(now);
                feedDTO.setStudyEndPoint(now);

                ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
                scheduler.scheduleAtFixedRate(() -> {
                    LocalDateTime newStudyEndPoint = LocalDateTime.now();
                    feedDTO.setStudyEndPoint(newStudyEndPoint);
                }, 0, 5, TimeUnit.SECONDS); // *********************배포시 변경**************************
            }

            // 전송할 메시지 생성
            String message = nickname + "님이 잠시 휴식 중입니다.";

            // 클라이언트에게 메시지 전송
            sendFeedNotification(session, userId, message);
        } else {
            String errorMessage = "Failed to process pause request";
            sendFeedNotification(session, userId, errorMessage);
        }
    }

}
