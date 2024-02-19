package studysns.server.security;
// JWT 토큰 기반 인증 방식
// -- 로그인 성공 > 서버에서 jwt token 발급 > 응답에 토큰을 같이 보낸다
// -- 클라이언트는 브라우저에 토큰을 저장한다(보통은 localStorage 에 저장)
// -- 클라이언트에서 로그인이 필요한 요청을 보낼 때, 토큰을 header 의 Auth 에 담아서 보낸다
// -- 서버에서 요청 객체의 header > Auth 정보에서 토큰을 가져온다 > 토큰이 유효한지 검증한다

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    TokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            String token = getBearerToken(request);

            if(token != null && !token.equalsIgnoreCase("null")){
                String userId = tokenProvider.validateAndGetUserId(token);

                // 사용자 정보를 담는 토큰을 생성한다
                Authentication authentication = new UsernamePasswordAuthenticationToken(String.valueOf(userId), null, AuthorityUtils.NO_AUTHORITIES);

                // 클라이언트의 요청을 받아 응답 사이에 일시적으로 authentication 정보를 저장하여 SecurityContextHolder 에 authentication 정보를 설정한다
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (Exception e){
            log.error("error while login try: {}" , e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    public String getBearerToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");

        if(StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")){
            return bearer.substring(7);
        }
        return null;
    }

}
