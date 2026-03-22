package org.costudy.backend.controller;

import org.costudy.backend.service.PresenceRegistry;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Controller
public class PresenceController {

    private final PresenceRegistry registry;
    private final SimpMessagingTemplate tpl;

    public PresenceController(PresenceRegistry registry, SimpMessagingTemplate tpl) {
        this.registry = registry;
        this.tpl = tpl;
    }

    @MessageMapping("/room/{roomId}/presence/join")
    public void handlePresenceJoin(
            @DestinationVariable int roomId,
            @Payload int userId,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String sessionId = headerAccessor.getSessionId();
        Set<Integer> online = registry.userJoined(sessionId, roomId, userId);
        tpl.convertAndSend("/topic/room/" + roomId + "/presence", online);
    }
}
