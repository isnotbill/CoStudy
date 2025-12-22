package org.costudy.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "spring.security.jwt")
@Getter @Setter
public class JwtProperties {
    private String secret;
    private long expiration;
    private long refreshExpiration;

    private Cookie cookie = new Cookie();

    @Getter @Setter
    public static class Cookie {
        private boolean secure;
        private boolean httpOnly;
        private String sameSite;
        private String domain;
        private String path = "/";
        private long maxAge;
    }
}
