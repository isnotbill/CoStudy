package org.costudy.backend.service;

import org.costudy.backend.dto.RegisterDto;
import org.costudy.backend.model.User;
import org.costudy.backend.repo.UserRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @InjectMocks
    AuthService authService;

    @Mock
    UserRepo userRepo;
    @Mock
    PasswordEncoder encoder;

    @Test
    void registerValidUser() {
        RegisterDto regUser = new RegisterDto();
        regUser.setUsername("testuser");
        regUser.setPassword("ValidPass1!");
        regUser.setEmail("testuser@gmail.com");
        regUser.setCaptchaToken("valid-captcha-token");
        Mockito.when(userRepo.existsByEmail(regUser.getEmail())).thenReturn(false);
        Mockito.when(userRepo.existsByUsername(regUser.getUsername())).thenReturn(false);
        Mockito.when(userRepo.save(Mockito.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(encoder.encode(regUser.getPassword())).thenReturn("encodedPassword");

        authService.register(regUser);

        Mockito.verify(userRepo, Mockito.times(1)).save(Mockito.any(User.class));
        Mockito.verify(encoder, Mockito.times(1)).encode("ValidPass1!");

    }
}
