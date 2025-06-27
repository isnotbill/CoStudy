package org.costudy.backend.controller;

import jakarta.validation.Valid;
import org.costudy.backend.dto.CreateRoomDto;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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

    @PostMapping("/settings/update/{roomId}")
    public ResponseEntity<ApiResponse<?>> updateStudyRoom(
            @PathVariable int roomId,
            @Valid @RequestBody CreateRoomDto dto,
            BindingResult result
    ) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for(FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Unable to update study room", errors)
            );
        }
        settingsService.updateRoom(roomId, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Updated Study Room"));
    }
}
