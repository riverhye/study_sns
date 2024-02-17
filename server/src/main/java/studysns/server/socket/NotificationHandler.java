//package studysns.server.socket;
//
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.io.IOException;
//import java.util.concurrent.CopyOnWriteArrayList;
//
//@Component
//
//public class NotificationHandler extends TextWebSocketHandler {
//
//    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
//
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        sessions.add(session);
//    }
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        // 여기서는 메시지를 처리하지 않고, 알림을 보내는 용도로 사용.
//    }
//
//    public void sendNotification(String notification) {
//        for (WebSocketSession session : sessions) {
//            if (session.isOpen()) {
//                try {
//                    session.sendMessage(new TextMessage(notification));
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            }
//        }
//    }
//
//}
