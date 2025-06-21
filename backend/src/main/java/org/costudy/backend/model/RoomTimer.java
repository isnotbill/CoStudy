package org.costudy.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomTimer {

    @Id
    @GeneratedValue
    private int timerId;
    private int roomId;
    private TimerPhase phase;
    private TimerStatus status;
    private int durationMs;
    private int workCyclesDone;
}
