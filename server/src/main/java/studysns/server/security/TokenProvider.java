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
        Date expireDate = Date.from(Instant.now().plus(1, ChronoUnit.DAYS));

        return Jwts.builder()
            .signWith(SignatureAlgorithm.HS512, jwtProperties.getSecretKey())
            .setSubject(String.valueOf(userEntity.getUserId()))
                .claim("nickname", userEntity.getNickname())
            .setIssuer(jwtProperties.getIssuer())
            .setIssuedAt(new Date())
            .setExpiration(expireDate)
            .compact();
    }

    public String validateAndGetUserId(String token){
        Claims claims = Jwts.parser()
            .setSigningKey(jwtProperties.getSecretKey())
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }
}
