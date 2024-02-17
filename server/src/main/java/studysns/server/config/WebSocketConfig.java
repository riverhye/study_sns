package studysns.server.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor

public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketHandler webSocketHandler;
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        ("ws://127.0.0.1:8080/socket")
        registry.addHandler(webSocketHandler, "/socket").setAllowedOrigins("*"); // 배포시에는 와일카드 제거.
    }

//    private final NotificationHandler notificationHandler;
//
//    public WebSocketConfig(NotificationHandler notificationHandler) {
//        this.notificationHandler = notificationHandler;
//    }
//
//    @Override void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        //        ("ws://127.0.0.1:8080/socket")
//        registry.addHandler(notificationHandler, "/notification").setAllowedOrigins("*");
//    }
}
