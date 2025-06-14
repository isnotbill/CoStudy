package org.costudy.backend.controller;

import org.costudy.backend.dto.ChatMessageDto;
import org.costudy.backend.model.ChatMessage;
import org.costudy.backend.repo.ChatMessageRepository;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.ChatMessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class ChatController {
    private final SimpMessagingTemplate tpl;
    private final ChatMessageService chatService;

    public ChatController(SimpMessagingTemplate tpl, ChatMessageService chatService) {
        this.tpl = tpl;
        this.chatService = chatService;
    }

    @MessageMapping("/room/{roomId}")
    public void handleMessage(
            @DestinationVariable int roomId,
            ChatMessageDto dto
    ) {
        chatService.save(dto, roomId);
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<?> getChatMessage(@PathVariable int roomId){

        List<ChatMessage> messages = chatService.getRoomMessages(roomId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched chat room messages", messages));
    }
}
