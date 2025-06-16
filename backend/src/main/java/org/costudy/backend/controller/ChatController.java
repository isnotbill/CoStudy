package org.costudy.backend.controller;

import org.costudy.backend.dto.ChatMessageDto;
import org.costudy.backend.model.ChatMessage;
import org.costudy.backend.repo.ChatMessageRepository;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.ChatMessageService;
import org.costudy.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class ChatController {
    private final SimpMessagingTemplate tpl;
    private final ChatMessageService chatService;
    private final UserService userService;

    public ChatController(SimpMessagingTemplate tpl, ChatMessageService chatService, UserService userService) {
        this.tpl = tpl;
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
    public ResponseEntity<ApiResponse<?>> getChatMessage(@PathVariable int roomId){
            try {
                List<ChatMessage> messages = chatService.getRoomMessages(roomId);
                return ResponseEntity.ok(new ApiResponse<>(true, "Fetched chat room messages", messages));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, e.getMessage()));
            }


    }
}
