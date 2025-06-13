package org.costudy.backend.dto;

import jakarta.persistence.Entity;


public class ChatMessageDto {
    public Long roomId;
    public int userId;
    public String content;
}
