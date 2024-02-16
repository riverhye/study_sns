package studysns.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import studysns.server.dto.FeedDTO;
import studysns.server.dto.FollowDTO;
import studysns.server.service.FeedService;

import java.util.List;

@RestController
@RequestMapping("/feed")

public class FeedController {

    private final FeedService feedService;

    @Autowired
    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @PostMapping("/addfeed")
    public ResponseEntity<String> addFeed(@RequestBody FeedDTO feedDTO) {
        feedService.addFeed(feedDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("feed added successfully");
    }
    
    @GetMapping("/getfeed/{feedId}")
//    api 명세: feedId(int Pk), studyContent(string), studyId(int), userId(int), studyStartPoint(timestamp), studyEndPoint(timestamp)
//    공부 시작/끝난 시간 로직은 클라이언트에서 작성? 일시정지 했을때 끝난시간을 기록하지 않으면 실제 공부시간과 feed 테이블에 저장되는 값이 다름.
//    시간 부분을 클라이언트에서 처리하면 추가적인 작업은 필요 없을듯.
    public ResponseEntity<List<FeedDTO>> getFeedByFeedId(@PathVariable long feedId) {
        List<FeedDTO> feedList = feedService.getFeedByFeedId(feedId);
        return ResponseEntity.ok(feedList);
    }


}
