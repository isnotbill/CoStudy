package org.costudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.costudy.backend.model.timer.RoomTimer;
import org.costudy.backend.model.timer.TimerPhase;
import org.costudy.backend.model.timer.TimerStatus;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimerDto {
    TimerPhase phase;
    TimerStatus status;
    Instant startedAt;
    long durationMs;
    int workCyclesDone;

    public static TimerDto from(RoomTimer t){
        return new TimerDto(
                t.getPhase(), t.getStatus(), t.getStartedAt(), t.getDurationMs(), t.getWorkCyclesDone()
        );
    }

}
