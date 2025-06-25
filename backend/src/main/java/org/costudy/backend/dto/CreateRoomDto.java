package org.costudy.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRoomDto {
    @NotBlank(message = "Room title is required")
    @Size(max = 25, message = "Title must be less than 25 characters")
    private String name;

    @NotNull(message = "Room visibility error")
    private boolean publicRoom;

    @Min(value = 1, message = "Study time must be at least 1 minute")
    @Max(value = 99, message = "Study time cannot exceed 99 minutes")
    private int studyTimeMs;

    @Min(value = 1, message = "Break time must be at least 1 minute")
    @Max(value = 99, message = "Break time cannot exceed 99 minutes")
    private int shortBreakTimeMs;

    @Min(value = 1, message = "Break time must be at least 1 minute")
    @Max(value = 99, message = "Break time cannot exceed 99 minutes")
    private int longBreakTimeMs;

    @Min(value = 1, message = "Cycles till long break must be at least 1")
    @Max(value = 20, message = "Cycles cannot exceed 20")
    private int cyclesTillLongBreak;
}
