package com.smartpark.config;

import com.smartpark.websocket.ParkingWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ParkingWebSocketHandler parkingWebSocketHandler;

    public WebSocketConfig(ParkingWebSocketHandler parkingWebSocketHandler) {
        this.parkingWebSocketHandler = parkingWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Register raw WebSocket endpoint with cross-origin pattern support
        registry.addHandler(parkingWebSocketHandler, "/ws/parking")
                .setAllowedOriginPatterns("*");

        // Also register with SockJS fallback for browsers/environments that require SockJS
        registry.addHandler(parkingWebSocketHandler, "/ws/parking-sockjs")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
