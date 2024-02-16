package studysns.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/todo")
public class TodoController {

    @GetMapping("/gettodo/{nickname,date}")
    public String gettodo() {
        return "gettodo";
    }

    @PostMapping("/maketodo")
    public String maketodo() {
        return "maketodo";
    }

    @DeleteMapping("/deletetodo/{todoId}")
    public String deletetodo(@PathVariable long todoId) {
        return "deletetodo";
    }

}
