package org.costudy.backend.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

public interface FileStorageService {

    String store(InputStream input, String filename, String contentType) throws IOException;
}
