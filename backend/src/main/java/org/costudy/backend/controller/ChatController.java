package org.costudy.backend.controller;

import org.costudy.backend.dto.ChatMessageDto;
import org.costudy.backend.model.ChatMessage;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.ChatMessageService;
import org.costudy.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
public class ChatController {
    private final ChatMessageService chatService;
    private final UserService userService;

    public ChatController(ChatMessageService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    @MessageMapping("/room/{roomId}")
    public void handleMessage(
            @DestinationVariable int roomId,
            ChatMessageDto dto
    ) {
        chatService.save(dto, roomId);
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ApiResponse<?>> getChatMessage(
            @PathVariable int roomId,
            @RequestParam(required = false) Integer before,
            @RequestParam(defaultValue = "20") int limit
    ) {
        Map<String, Object> result = chatService.getRoomMessages(roomId, before, limit);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched chat room messages", result));
    }
}
