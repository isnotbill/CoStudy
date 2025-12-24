package org.costudy.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "rate-limit")
@Data
public class RateLimitConfig {
    private Map<String, Integer> maxRequestsPerMin;
    public int getLimitFor(String key){
        return maxRequestsPerMin.getOrDefault(key, 5);
    }
}
