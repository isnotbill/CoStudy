package org.costudy.backend.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    public ApiResponse(boolean success, String message) {
         this(success, message, null);
    }




}
