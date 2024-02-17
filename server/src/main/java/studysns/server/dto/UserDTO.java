package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import studysns.server.entity.UserEntity;

@Getter
@Setter
@Builder
public class UserDTO {
    private long userId;
    private String email;
    private String nickname;
    private String password;
    private UserEntity.LoginType loginType;
    private String profileImage;
    private String token;
}
