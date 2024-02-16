package studysns.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysns.server.dto.FollowDTO;
import studysns.server.service.FollowService;

import java.util.List;

@RestController
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

    @GetMapping("/getfollow/{followerId}")
    // api 명세: followerId(int Pk), followId(int), userId(int)
//    follow 테이블이 잘 이해가 안됨. get 요청을 userId 로 바꿔야 하나? (그럴시에 UserEntity 에 userId 를 OneToMany 로.
//    일단 얘도 이대로 보내면 되긴 함.
    public ResponseEntity<List<FollowDTO>> getFollowByFollowerId(@PathVariable long followerId) {
        List<FollowDTO> followList = followService.getFollowByFollowerId(followerId);
        return ResponseEntity.ok(followList);
    }

}
