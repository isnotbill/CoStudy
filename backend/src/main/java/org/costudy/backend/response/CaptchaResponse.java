package org.costudy.backend.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CaptchaResponse {
    public boolean success;
    public String hostname;
}
