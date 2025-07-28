package org.costudy.backend.controller;

import org.costudy.backend.model.User;
import org.costudy.backend.service.S3Service;
import org.costudy.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class S3Controller {
    private final S3Service s3Service;

    private final UserService userService;

    public S3Controller(S3Service s3Service, UserService userService) {
        this.s3Service = s3Service;
        this.userService = userService;
    }

    @PostMapping("/api/{id}/upload")
    public ResponseEntity<String> upload(
            @RequestParam("file") MultipartFile file,
            @PathVariable int id
            ) throws IOException {
        String key = s3Service.uploadFile(file, id);
        User user = userService.getCurrentUserById(id);

        user.setImage(key);
        userService.save(user);

        return ResponseEntity.ok("File uploaded successfully");
    }
}
