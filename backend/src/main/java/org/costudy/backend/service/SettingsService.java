package org.costudy.backend.service;

import jakarta.validation.Valid;
import org.costudy.backend.dto.CreateRoomDto;
import org.costudy.backend.model.Settings;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.repo.SettingsRepo;
import org.costudy.backend.repo.StudyRoomRepo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsRepo settingsRepo;
    private final StudyRoomRepo roomRepo;
    private final TimerService timerService;

    private final SimpMessagingTemplate tpl;

    public SettingsService(SettingsRepo settingsRepo, StudyRoomRepo roomRepo, TimerService timerService, SimpMessagingTemplate tpl) {
        this.settingsRepo = settingsRepo;
        this.roomRepo = roomRepo;
        this.timerService = timerService;
        this.tpl = tpl;
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

    public CreateRoomDto getSettings(int roomId) {
        Settings roomSettings = settingsRepo.getSettingsByStudyRoomRoomId(roomId);
        StudyRoom studyRoom = roomSettings.getStudyRoom();
        CreateRoomDto createRoomDto = new CreateRoomDto();
        createRoomDto.setPublicRoom(roomSettings.isPublic());
        createRoomDto.setStudyTimeMs(roomSettings.getStudyTimeMs() / 60000); // To account for ms -> minutes conversion
        createRoomDto.setShortBreakTimeMs(roomSettings.getShortBreakTimeMs() / 60000); // To account for ms -> minutes conversion
        createRoomDto.setLongBreakTimeMs(roomSettings.getLongBreakTimeMs() / 60000); // To account for ms -> minutes conversion
        createRoomDto.setCyclesTillLongBreak(roomSettings.getCyclesTillLongBreak());
        createRoomDto.setName(studyRoom.getName());

        return createRoomDto;
    }

    public void updateRoom(int roomId, CreateRoomDto dto) {
        Settings roomSettings = settingsRepo.getSettingsByStudyRoomRoomId(roomId);
        StudyRoom studyRoom = roomSettings.getStudyRoom();
        roomSettings.setCyclesTillLongBreak(dto.getCyclesTillLongBreak());
        roomSettings.setShortBreakTimeMs(dto.getShortBreakTimeMs() * 60000);
        roomSettings.setLongBreakTimeMs(dto.getLongBreakTimeMs() * 60000);
        roomSettings.setStudyTimeMs(dto.getStudyTimeMs() * 60000);
        roomSettings.setPublic(dto.isPublicRoom());
        studyRoom.setName(dto.getName());

        roomRepo.save(studyRoom);
        settingsRepo.save(roomSettings);
        timerService.start(roomId);
        tpl.convertAndSend("/topic/settings/update", dto);
    }
}
