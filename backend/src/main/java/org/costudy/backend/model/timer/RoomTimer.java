package org.costudy.backend.model.timer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.costudy.backend.model.StudyRoom;

import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTimer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer timerId;

    @Enumerated(EnumType.STRING)
    private TimerPhase phase;
    @Enumerated(EnumType.STRING)
    private TimerStatus status;

    private Instant startedAt;
    private long durationMs;
    private int workCyclesDone;

    @OneToOne
    @JoinColumn(name = "roomId", nullable = false, unique = true)
    @JsonIgnore
    private StudyRoom room;
}
