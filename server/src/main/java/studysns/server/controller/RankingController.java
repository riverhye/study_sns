    package studysns.server.controller;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;
    import studysns.server.dto.RankingDTO;
    import studysns.server.service.RankingService;

    import java.util.List;

    @RestController
    @RequestMapping("/ranking")
    public class RankingController {

        @Autowired
        private RankingService rankingService;

        @GetMapping
        public ResponseEntity<List<RankingDTO>> getRankingList() {
            List<RankingDTO> rankingList = rankingService.getRankingList();
            return ResponseEntity.ok(rankingList);
        }
    }