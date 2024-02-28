package studysns.server.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import studysns.server.dto.FollowCountDTO;
import studysns.server.dto.FollowDTO;
import studysns.server.dto.StudyDTO;
import studysns.server.service.FollowService;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/follow")
public class FollowController {

    private final FollowService followService;

    @Autowired
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping("/addfollow")
    // "follow/add" 로 포스트 요청. 저장할 DTO 에 저장할 데이터는 followId 와 userId.
    public ResponseEntity<String> addFollow(@RequestBody FollowDTO followDTO) {
        followService.addFollow(followDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("follow added successfully");
    }

//    @GetMapping("/getfollow/{userId}")
//    // api 명세: followerId(int Pk), followId(int), userId(int)
//    public ResponseEntity<List<FollowDTO>> getFollowByUserId(@PathVariable long userId) {
//        List<FollowDTO> followList = followService.getFollowByUserId(userId);
//        return ResponseEntity.ok(followList);
//    }

    @GetMapping("/userfollow")
    public ResponseEntity<List<FollowCountDTO>> getFollow(@AuthenticationPrincipal String userId) {
        String userIdString = userId;
        long userIdLong = Long.parseLong(userIdString);
        List<FollowCountDTO> followInfo = followService.getFollowByUserId(userIdLong);
        return ResponseEntity.ok(followInfo);
    }

    @GetMapping("/checkfollow/{nickname}")
    public ResponseEntity<Boolean> checkFollow(@AuthenticationPrincipal String userId, @PathVariable String nickname) {
        String userIdString = userId;
        long userIdLong = Long.parseLong(userIdString);
        boolean isFollowing = followService.checkIfFollowing(userIdLong, nickname);
        return ResponseEntity.ok(isFollowing);
    }

    @GetMapping("/rank")
    public ResponseEntity<List<StudyDTO>> rankOrder() {
        List<StudyDTO> ranking = followService.orderRank();
        return ResponseEntity.ok(ranking);
    }

}
