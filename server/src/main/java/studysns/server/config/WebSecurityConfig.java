package studysns.server.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import studysns.server.security.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.cors(Customizer.withDefaults())
            .csrf(CsrfConfigurer::disable) // post, put 요청을 허용한다
            .sessionManagement(sessionManagement -> sessionManagement
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
//            .oauth2Login(oauth2 -> oauth2
//                    .loginPage("/login/oauth2/code/google") // 커스텀 로그인 페이지 URL
//                    .defaultSuccessUrl("/", true) // 로그인 성공 후 리다이렉트 URL
//                    .failureUrl("/login/oauth2/code/google") // 로그인 실패 시 리다이렉트 URL
//            )
            .authorizeHttpRequests(authorize ->  authorize
                    .requestMatchers("/", "/user/signin/process", "/user/signup", "/user/signup/process", "/user/social/login", "/api/auth/signin?callbackUrl=%2F", "/test", "/follow/**", "/feed/**", "/like/**", "/socket/**", "/study/**" ).permitAll() // 권한이 필요하지 않다
                    .anyRequest().authenticated() // 위의 주소 외에는 권한이 필요하다
            );

        http.addFilterAfter(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true); // 실제로 응답을 보낼 때 브라우저에게 자격 증명과 함께 요청을 보낼 수 있도록 허용한다
        config.setAllowedOriginPatterns(Arrays.asList("*")); // 모든 원본에서의 요청을 허용한다
        config.setAllowedMethods(Arrays.asList("HEAD", "POST", "GET", "DELETE", "PUT", "PATCH")); // 허용할 HTTP 메서드를 설정한다
        config.setAllowedHeaders(Arrays.asList("*")); // 모든 헤더의 요청을 허용한다

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 모든 경로에 대해 위에서 설정한 CORS 설정을 적용한다

        return source;
    }

}
