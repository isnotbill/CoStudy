package org.costudy.backend.controller;

import jakarta.validation.Valid;
import org.costudy.backend.dto.UpdateInfoDto;
import org.costudy.backend.dto.UpdatePasswordDto;
import org.costudy.backend.model.User;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.FileStorageService;
import org.costudy.backend.service.JwtService;
import org.costudy.backend.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final FileStorageService storage;
    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, FileStorageService storage, JwtService jwtService) {
        this.userService = userService;
        this.storage = storage;
        this.jwtService = jwtService;
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getCurrentUser(userDetails.getUsername()));
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable int id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        User user = userService.getCurrentUserById(id);

        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String filename = "user-" + id + "-" + UUID.randomUUID() + "." + ext;
        storage.store(file.getInputStream(), filename, file.getContentType());

        user.setImage(filename);
        userService.save(user);

        return ResponseEntity.ok(Map.of("avatarUrl", filename));
    }

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<?>> getUserRooms(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok().body(
                new ApiResponse<>(true, "Rooms fetched", userService.getUserRooms(userDetails.getUsername()))
        );
    }

    @DeleteMapping("/delete/account")
    public ResponseEntity<ApiResponse<?>> deleteAccount(@AuthenticationPrincipal UserDetails userDetails){
        User user = userService.getCurrentUser(userDetails.getUsername());
        userService.deleteAccount(user);
        return ResponseEntity.ok(new ApiResponse<>(true, "User " + user.getUsername() + " deleted"));

    }

    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<?>> ping(){
        return ResponseEntity.ok(new ApiResponse<>(true, "pong"));
    }


}
