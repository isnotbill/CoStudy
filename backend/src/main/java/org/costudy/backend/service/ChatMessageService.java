package org.costudy.backend.service;

import org.costudy.backend.dto.ChatMessageDto;
import org.costudy.backend.model.ChatMessage;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.model.User;
import org.costudy.backend.repo.ChatMessageRepository;
import org.costudy.backend.repo.StudyRoomRepo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {
    
    private final ChatMessageRepository chatRepo;
    private final StudyRoomRepo roomRepo;
    private final SimpMessagingTemplate tpl;
    
    public ChatMessageService(ChatMessageRepository chatRepo,
                              StudyRoomRepo roomRepo,
                              SimpMessagingTemplate tpl
    ) {
        this.chatRepo = chatRepo;
        this.roomRepo = roomRepo;
        this.tpl = tpl;
    }
    
    public void save(ChatMessageDto chatDto, int roomId) {
        ChatMessage msg = new ChatMessage();
        msg.setStudyRoom(roomRepo.findByRoomId(roomId));
        msg.setUserId(chatDto.getUserId());
        msg.setContent(chatDto.getContent());
        msg.setUsername(chatDto.getUsername());
        msg.setImageIcon(chatDto.getImageIcon());
        msg.setType(chatDto.getType());
        chatRepo.save(msg);
        tpl.convertAndSend("/topic/room/" + roomId, msg);
    }

    public List<ChatMessage> getRoomMessages(int roomId) {
        StudyRoom room = roomRepo.findByRoomId(roomId);
        if(room == null) {
            throw new IllegalArgumentException("Room does not exist");
        }
        return chatRepo.getChatMessageByStudyRoom(room);

    }
}
