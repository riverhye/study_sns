package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
import studysns.server.entity.UserEntity;

@Getter
@Setter
@Builder
public class UserDTO {
    private Long userId;
    private String email;
    private String nickname;
    private String password;
    private UserEntity.LoginType loginType;
    private String profileImage; // 파일이 저장될 위치 또는 URL
    private String token;
    private MultipartFile profileImageFile; // 프로필 이미지 파일
}
