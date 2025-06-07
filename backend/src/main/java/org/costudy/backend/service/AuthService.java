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

    public User saveUser(User user){
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }
}
