package org.costudy.backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalFileStorageService implements FileStorageService{
    private final Path uploadDir = Paths.get("uploads/avatars");

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(uploadDir);
    }
    @Override
    public String store(InputStream input, String filename, String contentType) throws IOException {
        Path dest = uploadDir.resolve(filename);
        Files.copy(input, dest, StandardCopyOption.REPLACE_EXISTING);

        return "/avatars/" + filename;
    }
}
