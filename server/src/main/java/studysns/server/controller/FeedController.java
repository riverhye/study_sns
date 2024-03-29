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
    
    @GetMapping("/getfeed/{userId}")
//    api 명세: feedId(int Pk), studyContent(string), studyId(int), userId(int), studyStartPoint(timestamp), studyEndPoint(timestamp)
    public ResponseEntity<List<FeedDTO>> getFeedByUserId(@PathVariable long userId) {
        List<FeedDTO> feedList = feedService.getFeedByUserId(userId);
        return ResponseEntity.ok(feedList);
    }

//    @PostMapping("/play/{feedId}")
//    public ResponseEntity<String> playStudy(@PathVariable long feedId) {
//        return ResponseEntity.ok("study started");
//    }
//    @PostMapping("/pause/{feedId}")
//    public ResponseEntity<String> pauseStudy(@PathVariable long feedId) {
//        return ResponseEntity.ok("study paused");
//    }
//    @PostMapping("/stop/{feedId}")
//    public ResponseEntity<String> stopStudy(@PathVariable long feedId) {
//        return ResponseEntity.ok("study stopped");
//    }


}
