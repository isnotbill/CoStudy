package org.costudy.backend.service;

import org.costudy.backend.repo.RoomTimerRepo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TimerService {

    private final RoomTimerRepo timerRepo;
    private final SimpMessagingTemplate tpl;

    public TimerService(RoomTimerRepo timerRepo, SimpMessagingTemplate tpl) {
        this.timerRepo = timerRepo;
        this.tpl = tpl;
    }


    public void start(Integer roomId) {
    }
}
