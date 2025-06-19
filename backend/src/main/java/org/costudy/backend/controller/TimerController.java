package org.costudy.backend.controller;

import org.costudy.backend.service.TimerService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TimerController {

    private final TimerService timerService;

    public TimerController(TimerService timerService) {
        this.timerService = timerService;
    }

    @MessageMapping("/timer/start")
    public void start(@Payload Map<String, Integer> body){
        timerService.start(body.get("roomId"));
    }

    @MessageMapping("/timer/pause")
    public void pause(@Payload int roomId){
        timerService.pause(roomId);
    }

    @MessageMapping("/timer/resume")
    public void resume(@Payload int roomId){
        timerService.resume(roomId);
    }




}
