package studysns.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysns.server.dto.LikeDTO;
import studysns.server.service.LikeService;

import java.util.List;

@RestController
@RequestMapping("/like")

public class LikeController {

    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/addlike")
    public ResponseEntity<String> addLike(@RequestBody LikeDTO likeDTO) {
        likeService.addLike(likeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Like added successfully");
    }

    @GetMapping("/getlike/{userId}")
//    api 명세: likeId(int Pk), feedId(int), studyId(int), userId(int)
//    likeTable 은 그냥 이 데이터 그대로 넘겨주면 될듯?
    public ResponseEntity<List<LikeDTO>> getLikesByUserId(@PathVariable long userId) {
        List<LikeDTO> likeList = likeService.getLikesByUserId(userId);
        return ResponseEntity.ok(likeList);
    }
}
