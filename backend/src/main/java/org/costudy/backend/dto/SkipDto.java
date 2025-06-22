package org.costudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.costudy.backend.model.timer.TimerPhase;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkipDto {
    private Integer roomId;
    private TimerPhase skipToPhase;
}
