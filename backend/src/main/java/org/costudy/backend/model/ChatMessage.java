package org.costudy.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @GeneratedValue
    private int chatMessageId;
    private int userId;
    private String content;
    private String username;
    private String imageIcon;
    private Instant sentAt = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private MessageType type; // USER | SERVER

    @ManyToOne
    @JoinColumn(name = "roomId", nullable = false)
    @JsonIgnore
    private StudyRoom studyRoom;
}
