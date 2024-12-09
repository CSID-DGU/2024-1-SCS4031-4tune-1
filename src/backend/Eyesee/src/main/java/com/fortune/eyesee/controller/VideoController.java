package com.fortune.eyesee.controller;

import com.fortune.eyesee.service.VideoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Slf4j
@RestController
@RequestMapping("/api/video")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }


    @PostMapping
    public ResponseEntity<String> uploadVideo(
            @RequestParam("userId") Integer userId,
            @RequestParam("startOffset") String startOffset, // ISO 8601 형식 문자열
            @RequestParam("endOffset") String endOffset, // ISO 8601 형식 문자열
            @RequestPart("video") MultipartFile videoFile) {
        try {
            log.info("컨트롤러 호출됨 - userId: {}, 파일 크기: {}", userId, videoFile.getSize());

            // ISO 8601 문자열을 LocalDateTime으로 변환
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME; // ISO 8601 형식 지원
            LocalDateTime startDateTime = LocalDateTime.parse(startOffset, formatter);
            LocalDateTime endDateTime = LocalDateTime.parse(endOffset, formatter);

            log.info("시작 시간: {}, 종료 시간: {}", startDateTime, endDateTime);

            String videoUrl = videoService.saveVideo(userId, startDateTime, endDateTime, videoFile);

            return ResponseEntity.ok(videoUrl);
        } catch (DateTimeParseException e) {
            e.printStackTrace();
            log.error("날짜 형식 변환 오류 - startOffset: {}, endOffset: {}", startOffset, endOffset, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 날짜 형식입니다.");
        } catch (IOException e) {
            e.printStackTrace();
            log.error("비디오 업로드 오류 - 파일명: {}, 파일 크기: {}", videoFile.getOriginalFilename(), videoFile.getSize(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload video");
        }   catch (Exception e) {
            e.printStackTrace();
            log.error("예상치 못한 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload video");
        }
    }
}