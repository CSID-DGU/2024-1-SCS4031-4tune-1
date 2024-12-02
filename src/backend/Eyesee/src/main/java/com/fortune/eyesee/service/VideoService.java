package com.fortune.eyesee.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.fortune.eyesee.entity.VideoRecording;
import com.fortune.eyesee.repository.VideoRecordingRepository;
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
    private final VideoRecordingRepository videoRecordingRepository;

    public VideoService(AmazonS3 amazonS3, VideoRecordingRepository videoRecordingRepository) {
        this.amazonS3 = amazonS3;
        this.videoRecordingRepository = videoRecordingRepository;
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

            String filePath = amazonS3.getUrl(bucketName, key).toString();

            // 비디오 정보를 DB에 저장
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


    private String generateFileName(Integer userId) {
        return userId + "_" + UUID.randomUUID() + ".webm";
    }
}