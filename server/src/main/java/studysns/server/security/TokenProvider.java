package studysns.server.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import studysns.server.config.jwt.JwtProperties;
import studysns.server.entity.UserEntity;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class TokenProvider {

    @Autowired
    JwtProperties jwtProperties;

    public String createToken(UserEntity userEntity){
        Date expireDate = Date.from(Instant.now().plus(1, ChronoUnit.DAYS)); // 만기 기준은 하루로 설정했습니다.

        return Jwts.builder()
            .signWith(SignatureAlgorithm.HS512, jwtProperties.getSecretKey()) // 암호화 방식을 설정한다, secretKey
            .setSubject(String.valueOf(userEntity.getUserId())) // 페이로드에 들어갈 정보
            .setIssuer(jwtProperties.getIssuer())
            .setIssuedAt(new Date()) // 언제 토큰이 발급이 되었는지 확인
            .setExpiration(expireDate) // 언제 만료가 되는지
            .compact(); // 로 마무리해야 토큰이 생성이 된다
    }

    public String validateAndGetUserId(String token){ // 토큰 검증
        Claims claims = Jwts.parser()
            .setSigningKey(jwtProperties.getSecretKey()) // 시크릿키 설정
            .parseClaimsJws(token) // 검증할 토큰 설정, 검증이 안 되면 예외 처리한다.
            .getBody(); // 페이로드를 get 하는 메소드이다.
        return claims.getSubject(); // 리턴하는 방법
    }
}
