package studysns.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import studysns.server.entity.UserEntity;
import studysns.server.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class SearchController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/searchUser/{searchNickname}")
    public ResponseEntity<List<UserResponse>> searchUser(@PathVariable String searchNickname) {
        List<UserEntity> users = userRepository.findByNicknameContaining(searchNickname);
        List<UserResponse> userResponses = users.stream()
                .map(user -> new UserResponse(user.getNickname(), user.getProfileImage(), false)) // isFollowing은 별도의 로직이 필요합니다.
                .collect(Collectors.toList());

        return ResponseEntity.ok(userResponses);
    }

    static class UserResponse {
        private String nickname;
        private String profileImage;
        private boolean isFollowing;

        public UserResponse(String nickname, String profileImage, boolean isFollowing) {
            this.nickname = nickname;
            this.profileImage = profileImage;
            this.isFollowing = isFollowing;
        }

        // getters
        public String getNickname() {
            return nickname;
        }

        public String getProfileImage() {
            return profileImage;
        }

        public boolean getIsFollowing() {
            return isFollowing;
        }

        // setters
        public void setNickname(String nickname) {
            this.nickname = nickname;
        }

        public void setProfileImage(String profileImage) {
            this.profileImage = profileImage;
        }

        public void setIsFollowing(boolean isFollowing) {
            this.isFollowing = isFollowing;
        }
    }

}