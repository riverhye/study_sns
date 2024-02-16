package studysns.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import studysns.server.dto.TodoDTO;

@Controller
@RequestMapping("/todo")
public class TodoController {

    @GetMapping("/gettodo/{nickname}/{date}")
    public String gettodo(@PathVariable String nickname, @PathVariable String date) {
        return "gettodo";
    }

    @PostMapping("/maketodo")
    public String maketodo(@RequestBody TodoDTO todoDTO) {
        return "maketodo";
    }

    @DeleteMapping("/deletetodo/{todoId}")
    public String deletetodo(@PathVariable long todoId) {
        return "deletetodo";
    }

}
