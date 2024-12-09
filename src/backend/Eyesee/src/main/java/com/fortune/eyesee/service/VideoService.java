package com.fortune.eyesee.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.fortune.eyesee.entity.VideoRecording;
import com.fortune.eyesee.repository.VideoRecordingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class VideoService {

    @Value("${aws.bucketName}")
    private String bucketName;

    private final AmazonS3 amazonS3;
    private final VideoRecordingRepository videoRecordingRepository;

    public VideoService(AmazonS3 amazonS3, VideoRecordingRepository videoRecordingRepository) {
        this.amazonS3 = amazonS3;
        this.videoRecordingRepository = videoRecordingRepository;
    }

    public String saveVideo(Integer userId, LocalDateTime startOffset, LocalDateTime endOffset, MultipartFile videoFile) throws IOException {
        // 파일 이름 생성
        String fileName = generateFileName(userId, videoFile.getOriginalFilename());
        String key = "videos/" + userId + "/" + fileName;

        try {
            // S3에 업로드
            InputStream fileContent = videoFile.getInputStream();
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(videoFile.getContentType());
            metadata.setContentLength(videoFile.getSize());

            amazonS3.putObject(bucketName, key, fileContent, metadata);


            // 로그로 업로드하는 파일 정보 출력
            log.info("업로드된 파일: {}", key);
            log.info("업로드된 파일 크기: {}", videoFile.getSize());
            log.info("업로드된 파일 타입: {}", videoFile.getContentType());
            log.info("업로드된 파일 이름: {}", videoFile.getOriginalFilename());
            log.info("업로드된 파일 메타데이터: {}", metadata.getContentType());
            log.info("업로드된 파일 메타데이터: {}", metadata.getContentLength());

            // 업로드된 파일의 URL 생성
            String filePath = amazonS3.getUrl(bucketName, key).toString();

            // 비디오 정보 DB에 저장
            saveVideoRecording(userId, startOffset, endOffset, filePath);

            return filePath;

        } catch (Exception e) {
            throw new IOException("Failed to upload video to S3", e);
        }
    }

    private void saveVideoRecording(Integer userId, LocalDateTime startTime, LocalDateTime endTime, String filePath) {
        VideoRecording videoRecording = new VideoRecording();
        videoRecording.setUserId(userId);
        videoRecording.setStartTime(startTime);
        videoRecording.setEndTime(endTime);
        videoRecording.setFilePath(filePath);

        videoRecordingRepository.save(videoRecording);
    }

    private String generateFileName(Integer userId, String originalFilename) {
        // 파일 확장자를 추출하여 파일 이름을 생성
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        return userId + "_" + UUID.randomUUID() + fileExtension;
    }
}