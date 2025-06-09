package org.costudy.backend.controller;

import jakarta.validation.Valid;
import org.costudy.backend.dto.RegisterDto;
import org.costudy.backend.model.User;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.AuthService;
import org.costudy.backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody RegisterDto registerDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .toList();

            return ResponseEntity.badRequest().body(new ApiResponse<>(false,
                    "Registration failed",
                    errors
            ));
        }
        System.out.println(bindingResult.hasErrors());
        authService.register(registerDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody User user){

        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            String token = jwtService.generateToken(user.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", token));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ApiResponse<>(false, "Invalid credentials", null)
            );
        }
    }

}
