package org.costudy.backend.service;

import org.costudy.backend.dto.CreateRoomDto;
import org.costudy.backend.model.Settings;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.repo.SettingsRepo;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsRepo settingsRepo;

    public SettingsService(SettingsRepo settingsRepo) {
        this.settingsRepo = settingsRepo;
    }

    public void createSettings(StudyRoom room, CreateRoomDto createRoomDto) {
        Settings roomSettings = new Settings();
        roomSettings.setStudyRoom(room);
        roomSettings.setPublic(createRoomDto.isPublic());
        roomSettings.setStudyTimeMs(createRoomDto.getStudyTimeMs());
        roomSettings.setShortBreakTimeMs(createRoomDto.getShortBreakTimeMs());
        roomSettings.setLongBreakTimeMs(createRoomDto.getLongBreakTimeMs());
        roomSettings.setCyclesTillLongBreak(createRoomDto.getCyclesTillLongBreak());

        settingsRepo.save(roomSettings);
    }
}
