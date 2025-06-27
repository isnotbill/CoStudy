package org.costudy.backend.exception;

import org.costudy.backend.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException e) {
        Map<String, String> response = new HashMap<>();
        response.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<?>> handleAuthenticationException(AuthenticationException e) {
        System.out.println("Auth exception");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(false, e.getMessage()));
    }

    @ExceptionHandler(RoomLimitExceededException.class)
    public ResponseEntity<ApiResponse<?>> handleRoomLimitExceeded(RoomLimitExceededException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse<>(false, e.getMessage()));
    }

}
