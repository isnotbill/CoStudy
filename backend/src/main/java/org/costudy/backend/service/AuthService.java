package org.costudy.backend.service;

import org.costudy.backend.model.User;
import org.costudy.backend.repo.UserRepo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepo repo;
    private final BCryptPasswordEncoder encoder;

    public AuthService(UserRepo userRepo) {
        this.repo = userRepo;
        this.encoder = new BCryptPasswordEncoder(12);
    }

    public void register(User user){
        if(repo.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if(repo.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        user.setPassword(encoder.encode(user.getPassword()));

        repo.save(user);
    }
}
