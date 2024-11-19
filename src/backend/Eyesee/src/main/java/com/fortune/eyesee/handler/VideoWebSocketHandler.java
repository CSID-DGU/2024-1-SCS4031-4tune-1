package com.fortune.eyesee.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fortune.eyesee.service.AIHttpService;
import com.fortune.eyesee.service.VideoCaptureService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@Component
public class VideoWebSocketHandler extends BinaryWebSocketHandler {

    private final AIHttpService aiHttpService;
    private final VideoCaptureService videoCaptureService;

    private final ExecutorService frameProcessingExecutor = Executors.newFixedThreadPool(4); // 병렬 처리 스레드 4개

    private final ConcurrentHashMap<String, ByteArrayOutputStream> sessionDataMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, UserSessionInfo> sessionInfoMap = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public VideoWebSocketHandler(AIHttpService aiHttpService, VideoCaptureService videoCaptureService) {
        this.aiHttpService = aiHttpService;
        this.videoCaptureService = videoCaptureService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            String payload = message.getPayload();

            if (payload.startsWith("INIT")) {
                String[] parts = payload.split(" ");
                if (parts.length == 3) {
                    Integer userId = Integer.parseInt(parts[1]);
                    Integer sessionId = Integer.parseInt(parts[2]);
                    sessionInfoMap.put(session.getId(), new UserSessionInfo(userId, sessionId));
                    session.sendMessage(new TextMessage("INIT_ACK"));
                    System.out.println("Initialized session: " + session.getId() + " with userID: " + userId + ", sessionID: " + sessionId);
                } else {
                    session.sendMessage(new TextMessage("INIT_FAILED"));
                    System.err.println("Invalid INIT message format: " + payload);
                }
            } else {
                session.sendMessage(new TextMessage("UNKNOWN_COMMAND"));
            }
        } catch (Exception e) {
            System.err.println("Error in handleTextMessage: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        try {
            ByteBuffer payload = message.getPayload();
            byte[] chunk = new byte[payload.remaining()];
            payload.get(chunk);

            // 세션별 데이터 버퍼 가져오기
            ByteArrayOutputStream buffer = sessionDataMap.computeIfAbsent(session.getId(), k -> new ByteArrayOutputStream());

            // 버퍼에 청크 추가
            buffer.write(chunk);

            // JPEG 프레임 확인
            byte[] bufferData = buffer.toByteArray();
            int startIdx = findStartOfImage(bufferData);
            int endIdx = findEndOfImage(bufferData);

            if (startIdx != -1 && endIdx != -1 && endIdx > startIdx) {
                byte[] completeFrame = extractFrame(bufferData, startIdx, endIdx);

                // 버퍼 초기화 (남은 데이터 유지)
                buffer.reset();
                if (endIdx + 1 < bufferData.length) {
                    buffer.write(bufferData, endIdx + 1, bufferData.length - endIdx - 1);
                }

                UserSessionInfo userSessionInfo = sessionInfoMap.get(session.getId());
                if (userSessionInfo != null) {
                    Integer userId = userSessionInfo.getUserId();
                    Integer sessionId = userSessionInfo.getSessionId();

                    // 비동기 프레임 처리
                    frameProcessingExecutor.submit(() -> {
                        videoCaptureService.processWebRTCData(userId, sessionId, completeFrame);
                    });
                } else {
                    System.err.println("No session info found for session: " + session.getId());
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing binary message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private int findStartOfImage(byte[] data) {
        for (int i = 0; i < data.length - 1; i++) {
            if (data[i] == (byte) 0xFF && data[i + 1] == (byte) 0xD8) {
                return i;
            }
        }
        return -1;
    }

    private int findEndOfImage(byte[] data) {
        for (int i = 0; i < data.length - 1; i++) {
            if (data[i] == (byte) 0xFF && data[i + 1] == (byte) 0xD9) {
                return i + 1;
            }
        }
        return -1;
    }

    private byte[] extractFrame(byte[] data, int startIdx, int endIdx) {
        int length = endIdx - startIdx + 1;
        byte[] frame = new byte[length];
        System.arraycopy(data, startIdx, frame, 0, length);
        return frame;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        System.out.println("WebSocket connection closed: " + session.getId());
        sessionInfoMap.remove(session.getId());
        sessionDataMap.remove(session.getId());
    }

    private static class UserSessionInfo {
        private final Integer userId;
        private final Integer sessionId;

        public UserSessionInfo(Integer userId, Integer sessionId) {
            this.userId = userId;
            this.sessionId = sessionId;
        }

        public Integer getUserId() {
            return userId;
        }

        public Integer getSessionId() {
            return sessionId;
        }
    }
}