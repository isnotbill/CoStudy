package org.costudy.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000", "https://costudy.online","https://www.costudy.online")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry broker) {
        broker
                .setApplicationDestinationPrefixes("/app")
                .enableSimpleBroker("/topic", "/queue");
    }
}
