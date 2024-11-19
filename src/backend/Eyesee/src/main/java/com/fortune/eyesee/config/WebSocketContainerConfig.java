package com.fortune.eyesee.config;

import jakarta.websocket.server.ServerContainer;
import org.apache.tomcat.websocket.server.WsServerContainer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class WebSocketContainerConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> customizeWebSocketContainer() {
        return factory -> factory.addContextCustomizers(context -> {
            WsServerContainer serverContainer = (WsServerContainer) context.getServletContext()
                    .getAttribute(ServerContainer.class.getName());

            if (serverContainer != null) {
                serverContainer.setDefaultMaxTextMessageBufferSize(512 * 1024); // 512KB 텍스트 메시지 제한
                serverContainer.setDefaultMaxBinaryMessageBufferSize(1 * 1024 * 1024); // 1MB 바이너리 메시지 제한
            }
        });
    }
}
