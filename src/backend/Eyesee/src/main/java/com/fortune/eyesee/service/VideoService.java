package com.fortune.eyesee.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class VideoService {

    @Value("${aws.bucketName}")
    private String bucketName;

    private final AmazonS3 amazonS3;

    public VideoService(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String saveVideo(Integer userId, LocalDateTime startOffset, LocalDateTime endOffset, MultipartFile videoFile) throws IOException {
        String fileName = generateFileName(userId);
        String key = "videos/" + userId + "/" + fileName;

        try {
            // S3에 업로드
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(videoFile.getContentType());
            metadata.setContentLength(videoFile.getSize());

            amazonS3.putObject(bucketName, key, videoFile.getInputStream(), metadata);

            // S3 URL 반환
            return amazonS3.getUrl(bucketName, key).toString();

        } catch (Exception e) {
            throw new IOException("Failed to upload video to S3", e);
        }
    }

    private String generateFileName(Integer userId) {
        return userId + "_" + UUID.randomUUID() + ".webm";
    }
}