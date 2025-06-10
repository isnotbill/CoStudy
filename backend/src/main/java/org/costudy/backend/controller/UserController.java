package org.costudy.backend.controller;


import org.costudy.backend.model.User;
import org.costudy.backend.service.FileStorageService;
import org.costudy.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final FileStorageService storage;
    private final UserService userService;

    public UserController(UserService userService, FileStorageService storage) {
        this.userService = userService;
        this.storage = storage;
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
        String publicPath = storage.store(file.getInputStream(), filename, file.getContentType());

        user.setImage(filename);
        userService.save(user);

        return ResponseEntity.ok(Map.of("avatarUrl", publicPath));
    }

}
