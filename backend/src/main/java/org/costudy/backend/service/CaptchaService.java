package org.costudy.backend.service;

import lombok.RequiredArgsConstructor;
import org.costudy.backend.response.CaptchaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class CaptchaService {
    private final String secret_key;
    private final String googleApiKey;

    public CaptchaService(@Value("${RECAPTCHA_SECRET_KEY}") String secret_key,
                          @Value("${GOOGLE_API_KEY}") String googleApiKey) {
        this.secret_key = secret_key;
        this.googleApiKey = googleApiKey;
    }

    public boolean verifyCaptcha(String token) {
        String url = "https://recaptchaenterprise.googleapis.com/v1/projects/costudy-464500/assessments?key=" + googleApiKey;

        System.out.println(url);

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> event = new HashMap<>();
        event.put("token", token);
        event.put("expectedAction", "USER_ACTION");
        event.put("siteKey", secret_key);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("event", event);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        return response.getStatusCode() == HttpStatus.OK;
    }
}
