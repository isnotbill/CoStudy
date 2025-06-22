package org.costudy.backend.controller;

import org.costudy.backend.dto.TimerDto;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.timer.RoomTimer;
import org.costudy.backend.model.timer.TimerPhase;
import org.costudy.backend.model.timer.TimerStatus;
import org.costudy.backend.service.TimerService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    public void pause(@Payload Integer roomId){
        timerService.pause(roomId);
    }

    @MessageMapping("/timer/resume")
    public void resume(@Payload Integer roomId){
        timerService.resume(roomId);

    }

    @MessageMapping("/timer/status")
    @SendToUser("/queue/timer")
    public TimerDto status(@Payload Integer roomId){
        return timerService.status(roomId);
    }

    @PostMapping("/timer/create/{roomId}")
    public TimerDto create(@PathVariable Integer roomId){
        return TimerDto.from(timerService.create(roomId));
    }






}
