package studysns.server.socket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component

public class WebSocketHandler extends TextWebSocketHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();
    // CLIENTS 라는 변수에 세션을 담아두기 위한 맵 형식의 공간

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        CLIENTS.put(session.getId(), session);
    } // 사용자가 웹 소켓 서버넹 접속하면 동작. 이때 WebSocketSession 값이 생성 되며 그걸 위에 만들어 둔 CLIENTS 변수에 put 으로 담아줌.

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        CLIENTS.remove(session.getId());
    } // 소켓 접속이 끝났을 때 동작. CLIENT 에 있는 해당 세션을 제거함.

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String id = session.getId();
        CLIENTS.entrySet().forEach( arg->{
            if(!arg.getKey().equals(id)) {
                try {
                    arg.getValue().sendMessage(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    } // 사용자의 메세지를 받게 되면 동작. CLIENT에 담긴 세션값들을 가져와 반복문으로 돌려, 위처럼 메세지를 발송해주면, 본인 이외의 사용자에세 메세지를 보낼 수 있음.
}
