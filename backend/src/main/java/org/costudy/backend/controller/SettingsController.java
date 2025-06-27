package org.costudy.backend.controller;

import org.costudy.backend.dto.CreateRoomDto;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SettingsController {

    private final SettingsService settingsService;


    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/settings/{roomId}")
    public ResponseEntity<ApiResponse<?>> getSettings(@PathVariable int roomId) {
        CreateRoomDto dto = settingsService.getSettings(roomId);

        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched settings", dto));
    }
}
