package org.costudy.backend.exception;

import java.util.Map;

public class InvalidCredentialsException extends RuntimeException {
    private Map<String, String> errors;
    public InvalidCredentialsException(String message) {
        super(message);
    }
    public InvalidCredentialsException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
