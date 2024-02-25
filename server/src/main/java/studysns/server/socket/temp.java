package studysns.server.socket;

public class temp {


//    public void handlePlayRequest(WebSocketSession session, String userId, FeedDTO feedDTO, String studyContent) {
//        String studyMessage = playStudy(session, feedDTO, userId, studyContent);
//
//        if (studyMessage != null) {
//            sendFeedNotification(session, userId, studyMessage);
//        } else {
//            String errorMessage = "공부 시작 실패";
//            try {
//                sendErrorMessageToClient(session, errorMessage);
//            } catch (IOException e) {
//                log.error("Failed to send error message to client: {}", e.getMessage(), e);
//            }
//        }
//    }
//
//    // 클라이언트에게 에러 메시지를 보내는 메소드
//    private void sendErrorMessageToClient(WebSocketSession session, String errorMessage) throws IOException {
//        ObjectMapper objectMapper = new ObjectMapper();
//        String errorJson = objectMapper.writeValueAsString(errorMessage);
//        session.sendMessage(new TextMessage(errorJson));
//        log.info("Error message has been sent to client: {}", errorMessage);
//    }
//
//
//
//
//    // 클라이언트로부터의 stop 메시지를 처리하는 메서드
//    public void handleStopRequest(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
//        stopStudy(session, userId, feedDTO, studyDTO);
//    }
//
//    // 클라이언트로부터의 pause 메시지를 처리하는 메서드
//    public void handlePauseRequest(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
//        pauseStudy(session, userId, feedDTO, studyDTO);
//    }
//    public String playStudy(WebSocketSession session, FeedDTO feedDTO, String userId, String studyContent) {
//        LocalDateTime now = LocalDateTime.now(); // 현재 시간
//
//        String nickname = null;
//
//        // 클레임에서 닉네임을 추출
//        String token = session.getUri().getQuery().substring(6);
//        if (token != null) {
//            try {
//                Claims claims = Jwts.parser()
//                        .setSigningKey(jwtProperties.getSecretKey())
//                        .parseClaimsJws(token)
//                        .getBody();
//                nickname = claims.get("nickname", String.class);
//            } catch (Exception e) {
//                log.error("Failed to parse JWT token: {}", e.getMessage());
//            }
//        }
//
//        // 일시 정지 했다가 다시 시작하는 경우
//        if (feedDTO.getStudyStartPoint() != null) {
//            // 기존의 기록을 삭제하고 새로운 기록을 시작
//            feedDTO.setStudyStartPoint(now);
//            feedDTO.setStudyEndPoint(now);
//
//            // 매 초마다 studyEndPoint 를 업데이트하는 스케줄러 시작
//            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
//            scheduler.scheduleAtFixedRate(() -> {
//                LocalDateTime studyEndPoint = LocalDateTime.now();
//                feedDTO.setStudyEndPoint(studyEndPoint);
//            }, 0, 5, TimeUnit.SECONDS); // 5초마다 추가된 시간이 EndPoint로 업데이트 | 테스트 과정에서 확인하기 편하도록 초로 설정했음. ***********배포시 꼭 변경***************
//
//            return nickname + " 님이 다시 " + studyContent + "공부를 시작했습니다."; // 클라이언트에게 전송할 메시지 반환
//
//        } else {
//            // 정지 또는 처음 시작을 하는 경우
//            feedDTO.setStudyStartPoint(now);
//            feedDTO.setStudyEndPoint(now);
//
//            ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
//            scheduler.scheduleAtFixedRate(() -> {
//                LocalDateTime studyEndPoint = LocalDateTime.now();
//                feedDTO.setStudyEndPoint(studyEndPoint);
//            }, 0, 5, TimeUnit.SECONDS);
//
//            return nickname + " 님이 " + studyContent + "공부를 시작했습니다."; // 클라이언트에게 전송할 메시지 반환
//        }
//    }
//
//
//    public void stopStudy(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
//        LocalDateTime studyStartPoint = feedDTO.getStudyStartPoint();
//        LocalDateTime studyEndPoint = LocalDateTime.now();
//
//        String nickname = null;
//
//        // 클레임에서 닉네임을 추출
//        String token = session.getUri().getQuery().substring(6);
//        if (token != null) {
//            try {
//                Claims claims = Jwts.parser()
//                        .setSigningKey(jwtProperties.getSecretKey())
//                        .parseClaimsJws(token)
//                        .getBody();
//                nickname = claims.get("nickname", String.class);
//            } catch (Exception e) {
//                log.error("Failed to parse JWT token: {}", e.getMessage());
//            }
//        }
//
//        if (studyStartPoint != null) {
//            // Calculate study duration in seconds
//            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);
//            long studySeconds = studyDuration.getSeconds();
//
//            // Convert study duration to minutes
//            long studyMinutes = studySeconds / 60;
//
//            // Update todayStudyTime in studyDTO
//            long updatedStudyTime = studyDTO.getTodayStudyTime() + studyMinutes;
//            studyDTO.setTodayStudyTime(updatedStudyTime);
//
//            // Delete studyStartPoint and studyEndPoint from feedDTO
//            feedDTO.setStudyStartPoint(null);
//            feedDTO.setStudyEndPoint(null);
//
//            // 전송할 메시지 생성
//            String message = nickname + "님이 공부를 마쳤습니다.";
//
//            // 클라이언트에게 메시지 전송
//            sendFeedNotification(session, userId, message);
//        } else {
//            String errorMessage = "Failed to process stop request";
//            sendFeedNotification(session, userId, errorMessage);
//        }
//    }
//
//    public void pauseStudy(WebSocketSession session, String userId, FeedDTO feedDTO, StudyDTO studyDTO) {
//        LocalDateTime studyStartPoint = feedDTO.getStudyStartPoint();
//        LocalDateTime studyEndPoint = LocalDateTime.now();
//
//        String nickname = null;
//
//        // 클레임에서 닉네임을 추출
//        String token = session.getUri().getQuery().substring(6);
//        if (token != null) {
//            try {
//                Claims claims = Jwts.parser()
//                        .setSigningKey(jwtProperties.getSecretKey())
//                        .parseClaimsJws(token)
//                        .getBody();
//                nickname = claims.get("nickname", String.class);
//            } catch (Exception e) {
//                log.error("Failed to parse JWT token: {}", e.getMessage());
//            }
//        }
//
//        if (studyStartPoint != null) {
//            Duration studyDuration = Duration.between(studyStartPoint, studyEndPoint);
//            long studySeconds = studyDuration.getSeconds();
//
//            long studyMinutes = studySeconds / 60;
//
//            long updatedStudyTime = studyDTO.getTodayStudyTime() + studyMinutes;
//            studyDTO.setTodayStudyTime(updatedStudyTime);
//
//            // 여기에서는 일단 휴식중인 시간이 기록됨
//            if (studyStartPoint != null) {
//                feedDTO.setStudyStartPoint(null);
//                feedDTO.setStudyEndPoint(null);
//
//                LocalDateTime now = LocalDateTime.now();
//
//                feedDTO.setStudyStartPoint(now);
//                feedDTO.setStudyEndPoint(now);
//
//                ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
//                scheduler.scheduleAtFixedRate(() -> {
//                    LocalDateTime newStudyEndPoint = LocalDateTime.now();
//                    feedDTO.setStudyEndPoint(newStudyEndPoint);
//                }, 0, 5, TimeUnit.SECONDS); // *********************배포시 변경**************************
//            }
//
//            // 전송할 메시지 생성
//            String message = nickname + "님이 잠시 휴식 중입니다.";
//
//            // 클라이언트에게 메시지 전송
//            sendFeedNotification(session, userId, message);
//        } else {
//            String errorMessage = "Failed to process pause request";
//            sendFeedNotification(session, userId, errorMessage);
//        }
//    }
}
