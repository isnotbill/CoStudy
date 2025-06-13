package org.costudy.backend.service;

import org.costudy.backend.model.ChatMessage;
import org.costudy.backend.repo.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {
    
    private final ChatMessageRepository repo;
    
    public ChatMessageService(ChatMessageRepository repo) {
        this.repo = repo;
    }
    
    public void save(ChatMessage msg) {
        repo.save(msg);
    }

    public List<ChatMessage> getRoomMessages(int roomId) {
        return repo.getChatMessageByRoomId(roomId);
    }
}
