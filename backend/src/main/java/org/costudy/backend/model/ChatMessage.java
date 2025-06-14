package org.costudy.backend.model;

import jakarta.persistence.*;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int chatMessageId;
    private int userId;
    private String content;
    public String username;
    public String imageIcon;
    private Instant sentAt = Instant.now();

    @ManyToOne
    @JoinColumn(name = "roomId", nullable = false)
    private StudyRoom studyRoom;
}
