package com.fortune.eyesee.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class AIHttpService {

    private static final String AI_SERVER_URL = "http://localhost:8000/process_video";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CheatingResult processWebRTCData(Integer userId, Integer sessionId, byte[] frameData) {
        long startTime = System.currentTimeMillis(); // 시작 시간 기록
        try {
            RestTemplate restTemplate = new RestTemplate();

            // HTTP 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Multipart 요청 데이터 구성
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("user_id", userId.toString());
            body.add("session_id", sessionId.toString());
            body.add("file", new ByteArrayResource(frameData) {
                @Override
                public String getFilename() {
                    return "frame.jpg";
                }
            });

            // HTTP 요청 생성 및 AI 서버 호출
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(AI_SERVER_URL, requestEntity, String.class);

            // 결과 매핑
            return objectMapper.readValue(response, CheatingResult.class);

        } catch (Exception e) {
            System.err.println("Error processing WebRTC data: " + e.getMessage());
            e.printStackTrace();
            return null;
        } finally {
            long elapsedTime = System.currentTimeMillis() - startTime; // 경과 시간 계산
            log.info("AI API call took {} ms for userId={}, sessionId={}", elapsedTime, userId, sessionId);
        }
    }
}