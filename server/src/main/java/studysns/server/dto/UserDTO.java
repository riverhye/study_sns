package studysns.server.dto;

import lombok.Builder;
import lombok.Getter;
import studysns.server.entity.UserEntity;

@Getter
@Builder
public class UserDTO {
    private long id;
    private String email;
    private String nickname;
    private String password;
    private UserEntity.LoginType loginType;
}
