package org.costudy.backend.service;

import org.costudy.backend.dto.RegisterDto;
import org.costudy.backend.exception.InvalidCredentialsException;
import org.costudy.backend.mapper.UserMapper;
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

    public void register(RegisterDto registerDto){
        if(repo.existsByEmail(registerDto.getEmail())) {
            throw new InvalidCredentialsException("Email already exists");
        }
        if(repo.existsByUsername(registerDto.getUsername())) {
            throw new InvalidCredentialsException("Username already exists");
        }

        User user = UserMapper.toUser(registerDto);
        user.setPassword(encoder.encode(user.getPassword()));

        repo.save(user);
    }
}
