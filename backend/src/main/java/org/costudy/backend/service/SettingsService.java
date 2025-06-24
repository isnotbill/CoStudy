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
        roomSettings.setPublic(createRoomDto.isPublicRoom());
        roomSettings.setStudyTimeMs(createRoomDto.getStudyTimeMs() * 60000);
        roomSettings.setShortBreakTimeMs(createRoomDto.getShortBreakTimeMs() * 60000);
        roomSettings.setLongBreakTimeMs(createRoomDto.getLongBreakTimeMs() * 60000);
        roomSettings.setCyclesTillLongBreak(createRoomDto.getCyclesTillLongBreak());

        settingsRepo.save(roomSettings);
    }
}
