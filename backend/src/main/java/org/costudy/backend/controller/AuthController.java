package org.costudy.backend.controller;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.costudy.backend.dto.LoginDto;
import org.costudy.backend.dto.RegisterDto;
import org.costudy.backend.model.User;
import org.costudy.backend.response.ApiResponse;
import org.costudy.backend.service.AuthService;
import org.costudy.backend.service.JwtService;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
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
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody LoginDto loginDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .toList();

            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Login failed", errors));
        }

        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String accessToken = jwtService.generateAccessToken(userDetails.getUsername());
            String refreshToken = jwtService.generateRefreshToken(userDetails.getUsername());

            ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", accessToken)
                    .httpOnly(true)
                    .secure(false) // TODO: SET TRUE IN PRODUCTION
                    .path("/")
                    .maxAge(24*60*60)
                    .sameSite("Lax")
                    .build();

            ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .secure(false) // TODO: SET TRUE IN PRODUCTION
                    .path("/")
                    .maxAge(24*60*60)
                    .sameSite("Lax")
                    .build();

            System.out.println("Refresh: " + refreshToken);
            System.out.println("Access: " + accessToken);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                    .body(new ApiResponse<>(true, "Login successful"));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ApiResponse<>(false, "Invalid credentials")
            );
        }
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<ApiResponse<?>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
            ) {

        Cookie[] cookies = request.getCookies();
        String refreshToken = null;
        for(Cookie c : cookies) {
            if("refresh_token".equals(c.getName())) {
                refreshToken = c.getValue();
                break;
            }
        }

        if(refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ApiResponse<>(false, "Invalid refresh token"));
        }

        String username = null;
        try {
            username = jwtService.extractUserName(refreshToken);
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new ApiResponse<>(false, "Expired refresh token")
            );
        }

        String accessToken = jwtService.generateAccessToken(username);
        ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(false) // TODO: SET TRUE IN PRODUCTION
                .path("/")
                .maxAge(24*60*60)
                .sameSite("Lax")
                .build();

        System.out.println("Refresh: " + refreshToken);
        System.out.println("Access: " + accessToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .body(new ApiResponse<>(true, "Token refreshed"));
    }

//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(HttpServletResponse response){
//
//        ResponseCookie clearAccess = ResponseCookie.from("access_token","")
//                .httpOnly(true)
//                .secure(false) // TODO: SET TRUE IN PRODUCTION
//                .path("/")
//                .maxAge(0)
//                .sameSite("Strict")
//                .build();
//
//        ResponseCookie clearRefresh = ResponseCookie.from("refresh_token","")
//                .httpOnly(true)
//                .secure(false) // TODO: SET TRUE IN PRODUCTION
//                .path("/")
//                .maxAge(0)
//                .sameSite("Strict")
//                .build();
//
//        response.addHeader(HttpHeaders.SET_COOKIE, clearAccess.toString());
//        response.addHeader(HttpHeaders.SET_COOKIE, clearRefresh.toString());
//
//        return ResponseEntity.ok()
//                .body(new ApiResponse<>(true, "Logout successful"));
//
//    }

}
