package org.costudy.backend.exception;

public class RoomLimitExceededException extends RuntimeException {
    public RoomLimitExceededException(String message) {
        super(message);
    }
}
