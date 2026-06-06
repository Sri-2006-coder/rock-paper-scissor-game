package com.harshini.rpsbackend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin("*")
public class GameController {

    @GetMapping("/play")
    public Map<String,String> play(@RequestParam String choice) {

        String[] options = {"rock","paper","scissors"};

        String computer =
                options[new Random().nextInt(3)];

        String result;

        if(choice.equals(computer))
            result = "Draw";

        else if(
                (choice.equals("rock") && computer.equals("scissors"))
                ||
                (choice.equals("paper") && computer.equals("rock"))
                ||
                (choice.equals("scissors") && computer.equals("paper"))
        )
            result = "You Win";

        else
            result = "Computer Wins";

        Map<String,String> response =
                new HashMap<>();

        response.put("player",choice);
        response.put("computer",computer);
        response.put("result",result);

        return response;
    }
}