package org.costudy.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue
    private int chatMessageId;
    private int roomId;
    private int userId;
    private String content;
    public String username;
    public String imageIcon;
    private Instant sentAt = Instant.now();
}
