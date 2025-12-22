package org.costudy.backend.service;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Collections;

@ExtendWith(MockitoExtension.class)
public class JwtServiceTest {
    @InjectMocks
    private JwtService jwtService;

    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(jwtService, "secretKey", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "expiration", 1000 * 60 * 15);
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", 1000 * 60 * 60 * 24 * 7);
    }

    @Test
    void generateAccessTokenAndValidate() {
        String username = "testuser";
        UserDetails userDetails = new User(username, "password", Collections.emptyList());

        String token = jwtService.generateAccessToken(username);

        assertNotNull(token);
        assertTrue(jwtService.validateToken(token, userDetails));
        assertEquals(username, jwtService.extractUserName(token));
    }

    @Test
    void invalidateExpiredToken() {
        ReflectionTestUtils.setField(jwtService, "expiration", -1000);
        String username = "testuser";

        UserDetails userDetails = new User(username, "password", Collections.emptyList());

        String token = jwtService.generateAccessToken(username);

        assertThrows(ExpiredJwtException.class, () -> {
            jwtService.validateToken(token, userDetails);
        });
    }
}
