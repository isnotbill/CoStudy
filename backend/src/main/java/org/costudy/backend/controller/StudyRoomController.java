package org.costudy.backend.controller;

import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.StudyRoomService;
import org.costudy.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/room")
public class StudyRoomController {

    private final StudyRoomService roomService;
    private final UserService userService;

    public StudyRoomController(StudyRoomService studyRoomService, UserService userService) {
        this.roomService = studyRoomService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createStudyRoom(@AuthenticationPrincipal UserDetails userDetails, @RequestBody(required = false) String name) {
        if(name == null || name.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Invalid name"));
        }
        String code = roomService.createRoom(userService.getCurrentUser(userDetails.getUsername()), name);
        return ResponseEntity.ok(new ApiResponse<>(true, "Created Study Room", code));
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<ApiResponse<?>> getStudyRoom(@PathVariable String roomCode) {
        StudyRoom studyRoom = roomService.getStudyRoom(roomCode);
        if(studyRoom == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Invalid Room"));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched study room", studyRoom));
    }

    @DeleteMapping("/delete/{roomId}")
    public ResponseEntity<ApiResponse<?>> deleteStudyRoom(@AuthenticationPrincipal UserDetails userDetails, @PathVariable int roomId) {
        try {
            roomService.deleteRoomById(
                    roomId,
                    userService.getCurrentUser(userDetails.getUsername())
            );
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Room successfully deleted"));
        }
        catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, e.getMessage()));
        } catch (Exception e) {
            // Log error if needed
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "An error occurred while deleting the room."));
        }

    }
}
