package org.costudy.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Settings {

    @Id
    @GeneratedValue
    private int settingsId;
    private boolean isPublic;
    private int studyTimeMs;
    private int shortBreakTimeMs;
    private int longBreakTimeMs;
    private int cyclesTillLongBreak;

    @OneToOne
    @JoinColumn(name = "roomId")
    private StudyRoom studyRoom;
}
