package com.fortune.eyesee.service;

import com.fortune.eyesee.entity.DetectedCheating;
import com.fortune.eyesee.repository.DetectedCheatingRepository;
import com.fortune.eyesee.utils.S3Uploader;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Deque;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class CheatingService {

    @Autowired
    private CheatingValidationService cheatingValidationService;
    @Autowired
    private CheatingTypeMappingService cheatingTypeMappingService;
    @Autowired
    private S3Uploader s3Uploader;

    private final DateTimeFormatter timestampFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public void processCheatingResult(Integer userId, Integer sessionId, CheatingResult result, Deque<Mat> frameBuffer) {

        // 부정행위 결과를 처리, 없는 부정행위 타입은 무시
        if (result == null || result.getCheatingCounts() == null || result.getCheatingCounts().isEmpty()) {
            return;
        }
        // 부정행위 결과의 타임스탬프를 파싱
        LocalDateTime cheatingTimestamp = LocalDateTime.parse(result.getTimestamp(), timestampFormatter);

        // 부정행위 타입을 순회하며 기존 기록과 비교
        result.getCheatingCounts().forEach((cheatingTypeName, currentCount) -> {
            try {
                Integer cheatingTypeId = cheatingTypeMappingService.getCheatingTypeId(cheatingTypeName);

                Integer previousCount = cheatingValidationService.getExistingCheatingCount(userId, sessionId, cheatingTypeId);

                if (currentCount > (previousCount != null ? previousCount : 0)) {
                    cheatingValidationService.saveNewCheatingRecord(userId, sessionId, cheatingTypeId, cheatingTimestamp);
                    saveClipToS3(frameBuffer, cheatingTimestamp);
                }
            } catch (IllegalArgumentException e) {
                System.err.println("Unknown cheating type: " + cheatingTypeName);
            }
        });
    }

    private void saveClipToS3(Deque<Mat> frameBuffer, LocalDateTime cheatingTimestamp) {
        try {
            LocalDateTime startTime = cheatingTimestamp.minusSeconds(15);
            LocalDateTime endTime = cheatingTimestamp.plusSeconds(15);

            Deque<Mat> selectedFrames = new ConcurrentLinkedDeque<>();
            for (Mat frame : frameBuffer) {
                if (!frame.empty() && isWithinTimeRange(frame, startTime, endTime)) {
                    selectedFrames.add(frame);
                }
            }

            if (selectedFrames.isEmpty()) {
                System.err.println("No frames available for the specified time range.");
                return;
            }

            String filePath = "detected_clip_" + cheatingTimestamp.toString().replace(":", "-") + ".mp4";
            s3Uploader.uploadVideo(selectedFrames, filePath);
            System.out.println("Clip saved locally: " + filePath);
        } catch (Exception e) {
            System.err.println("Error saving clip locally: " + e.getMessage());
        }
    }

    private boolean isWithinTimeRange(Mat frame, LocalDateTime startTime, LocalDateTime endTime) {
        return true; // 실제 구현 필요
    }
}