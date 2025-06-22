package org.costudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoomDto {
    private String name;

    private boolean isPublic;
    private int studyTimeMs;
    private int shortBreakTimeMs;
    private int longBreakTimeMs;
    private int cyclesTillLongBreak;
}
