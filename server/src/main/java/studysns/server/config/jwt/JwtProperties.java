package studysns.server.config.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties("jwt") // 해당 클래스의 어플리케이션 프로퍼티 jwt 관련 속성을 참고한다
public class JwtProperties {
    private String issuer;
    private String secretKey;
}
