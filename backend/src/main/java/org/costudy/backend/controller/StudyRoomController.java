package org.costudy.backend.controller;

import org.apache.coyote.Response;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.StudyRoomService;
import org.costudy.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
public class StudyRoomController {

    private final StudyRoomService roomService;
    private final UserService userService;

    public StudyRoomController(StudyRoomService studyRoomService, UserService userService) {
        this.roomService = studyRoomService;
        this.userService = userService;
    }

    @PostMapping("/studyroom")
    public ResponseEntity<ApiResponse<?>> createStudyRoom(@AuthenticationPrincipal UserDetails userDetails) {
        roomService.createRoom(userService.getCurrentUser(userDetails.getUsername()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Created Study Room"));
    }

    @GetMapping("/studyroom/{roomCode}")
    public ResponseEntity<ApiResponse<?>> getStudyRoom(@PathVariable String roomCode) {
        StudyRoom studyRoom = roomService.getStudyRoom(roomCode);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched study room", studyRoom));
    }
}
