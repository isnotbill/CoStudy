package org.costudy.backend.dto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private Long roomId;
    private int userId;
    private String content;
    private String username;
    private String imageIcon;
}
