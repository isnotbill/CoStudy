package org.costudy.backend.service;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;

@Component
public class PresenceEventListener {

    private final PresenceRegistry registry;
    private final SimpMessagingTemplate tpl;

    public PresenceEventListener(PresenceRegistry registry, SimpMessagingTemplate tpl) {
        this.registry = registry;
        this.tpl = tpl;
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        int[] entry = registry.userLeft(sessionId);
        if (entry == null) return; // session never joined a room
        int roomId = entry[0];
        Set<Integer> online = registry.getOnlineUsers(roomId);
        tpl.convertAndSend("/topic/room/" + roomId + "/presence", online);
    }
}
