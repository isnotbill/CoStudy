package org.costudy.backend.controller;

import jakarta.validation.Valid;
import org.costudy.backend.dto.ChatMessageDto;
import org.costudy.backend.dto.CreateRoomDto;
import org.costudy.backend.dto.PublicRoomDto;
import org.costudy.backend.dto.UserDto;
import org.costudy.backend.model.ChatMessage;
import org.costudy.backend.model.StudyRoom;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.StudyRoomService;
import org.costudy.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/room")
public class StudyRoomController {

    private final StudyRoomService roomService;
    private final UserService userService;
    private final SimpMessagingTemplate tpl;
    private final PagedResourcesAssembler<PublicRoomDto> pagedResourcesAssembler;

    public StudyRoomController(StudyRoomService studyRoomService,
                               UserService userService,
                               SimpMessagingTemplate tpl,
                               PagedResourcesAssembler<PublicRoomDto> pagedResourcesAssembler
    ) {
        this.roomService = studyRoomService;
        this.userService = userService;
        this.tpl = tpl;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createStudyRoom(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateRoomDto createRoomDto,
            BindingResult result
    ) {
        if(result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for(FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Unable to create study room", errors)
            );
        }
        String code = roomService.createRoom(userService.getCurrentUser(userDetails.getUsername()), createRoomDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Created Study Room", code));
    }

    @PostMapping("/{roomCode}/join")
    public ResponseEntity<ApiResponse<?>> joinStudyRoom(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String roomCode
            ) {

        StudyRoom room = roomService.getStudyRoom(roomCode);
        UserDto user = roomService.joinRoom(userService.getCurrentUser(userDetails.getUsername()), roomCode);
        ChatMessage chat = roomService.announceJoin(userService.getCurrentUser(userDetails.getUsername()), room);
        tpl.convertAndSend("/topic/room/" + room.getRoomId(), chat);
        tpl.convertAndSend("/topic/room/" + roomCode + "/join", user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successfully joined room"));

    }

    @DeleteMapping("/{roomCode}/leave")
    public ResponseEntity<ApiResponse<?>> leaveStudyRoom(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String roomCode
    ) {
        roomService.leaveRoom(
                userService.getCurrentUser(userDetails.getUsername()),
                roomCode
                );
        StudyRoom room = roomService.getStudyRoom(roomCode);
        ChatMessage kickAnnouncement = roomService.announceLeave(userService.getCurrentUser(userDetails.getUsername()), room);
        tpl.convertAndSend("/topic/room/" + room.getRoomId(), kickAnnouncement);
        tpl.convertAndSend("/topic/room/" + roomCode + "/kick", userDetails.getUsername());
        return ResponseEntity.ok(new ApiResponse<>(true, "User left room"));
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<ApiResponse<?>> getStudyRoom(@PathVariable String roomCode) {
        StudyRoom studyRoom = roomService.getStudyRoom(roomCode);
        if(studyRoom == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Invalid Room"));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched study room", studyRoom));
    }

    @GetMapping("/{roomCode}/users")
    public ResponseEntity<ApiResponse<?>> getUsersInRoom(@PathVariable String roomCode) {
        List<UserDto> users = roomService.getUsersInRoom(roomCode);
        return ResponseEntity.ok(new ApiResponse<>(true, "Fetched users in room: " + roomCode, users));
    }

    @DeleteMapping("/{roomCode}/kick")
    public ResponseEntity<ApiResponse<?>> kickUserInRoom(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String roomCode, @RequestBody String username) {
        if(userDetails.getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    new ApiResponse<>(false, "Admin cannot kick themself")
            );
        }
        roomService.kickUser(
                roomCode,
                userService.getCurrentUser(userDetails.getUsername()),
                userService.getCurrentUser(username)
                );

        StudyRoom room = roomService.getStudyRoom(roomCode);
        ChatMessage kickAnnouncement = roomService.announceKick(userService.getCurrentUser(username), room);
        tpl.convertAndSend("/topic/room/" + room.getRoomId(), kickAnnouncement);

        tpl.convertAndSend("/topic/room/" + roomCode + "/kick", username);
        return ResponseEntity.ok(new ApiResponse<>(true, "Kicked " + username));
    }

    @DeleteMapping("/{roomId}/delete")
    public ResponseEntity<ApiResponse<?>> deleteStudyRoom(@AuthenticationPrincipal UserDetails userDetails, @PathVariable int roomId) {
        roomService.deleteRoomById(
                roomId,
                userService.getCurrentUser(userDetails.getUsername())
        );
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Room successfully deleted"));
    }

    @GetMapping("/public")
    public ResponseEntity<PagedModel<EntityModel<PublicRoomDto>>> getPublicRooms(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "") String keyword
    ) {
        Page<PublicRoomDto> pageRes = roomService.getPublicRooms(page, limit, keyword, userDetails.getUsername());

        PagedModel<EntityModel<PublicRoomDto>> pagedModel
                = pagedResourcesAssembler.toModel(pageRes);

        return ResponseEntity.ok(pagedModel);
    }
}
