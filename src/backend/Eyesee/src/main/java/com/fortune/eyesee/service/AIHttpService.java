package com.fortune.eyesee.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

@Service
public class AIHttpService {

    //    private static final String AI_SERVER_URL = "https://76f7-210-94-168-64.ngrok-free.app/process_video"; // AI 서버 URL
    private static final String AI_SERVER_URL = "http://localhost:8000/process_video"; // AI 서버 URL
    private final ObjectMapper objectMapper = new ObjectMapper();
    public CheatingResult detectCheating(Integer userId, File file) {
        try {
            // HTTP 요청 생성
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Multipart 데이터 구성
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("user_id", userId);
            body.add("file", new FileSystemResource(file)); // File을 Multipart로 변환

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // AI 서버 호출 및 응답 처리
            String response = restTemplate.postForObject(AI_SERVER_URL, requestEntity, String.class);

            // JSON 응답을 CheatingResult 객체로 매핑
            return objectMapper.readValue(response, CheatingResult.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // 실패 시 null 반환
        }
    }

    private File saveImageToTempFile(BufferedImage image) throws Exception {
        // UUID로 임시 파일 이름 생성
        String tempFileName = "temp-" + UUID.randomUUID() + ".jpg";
        File tempFile = new File(System.getProperty("java.io.tmpdir"), tempFileName);

        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            ImageIO.write(image, "jpg", fos);
        }

        return tempFile;
    }
}