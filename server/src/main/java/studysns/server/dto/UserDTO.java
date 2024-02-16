package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import studysns.server.entity.UserEntity;

@Getter
@Builder
public class UserDTO {
    private long userId;
    private String email;
    private String nickname;
    private String password;
    private UserEntity.LoginType loginType;
    private String profileImage;
}
