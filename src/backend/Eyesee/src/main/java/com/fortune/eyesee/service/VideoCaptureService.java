package com.fortune.eyesee.service;

import com.fortune.eyesee.repository.DetectedCheatingRepository;
import com.fortune.eyesee.utils.S3Uploader;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.FrameGrabber;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.bytedeco.javacv.OpenCVFrameConverter;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.bytedeco.opencv.global.opencv_core.flip;

@Service
public class VideoCaptureService {

    private final AIHttpService aiHttpService;
    private final S3Uploader s3Uploader;
    private final CheatingValidationService cheatingValidationService;
    private final DetectedCheatingRepository detectedCheatingRepository;
    private final Deque<FrameData> frameBuffer = new ArrayDeque<>();
    private final int bufferSize = 300;
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    private CheatingTypeMappingService cheatingTypeMappingService;

    public VideoCaptureService(AIHttpService aiHttpService, S3Uploader s3Uploader,
                               CheatingValidationService cheatingValidationService,
                               DetectedCheatingRepository detectedCheatingRepository) {
        this.aiHttpService = aiHttpService;
        this.s3Uploader = s3Uploader;
        this.cheatingValidationService = cheatingValidationService;
        this.detectedCheatingRepository = detectedCheatingRepository;
    }

    public void startCapture(Integer userId, Integer sessionId) {
        try (FrameGrabber grabber = FrameGrabber.createDefault(0)) {
            grabber.start();
            OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();

            while (true) {
                Frame frame = grabber.grab();
                if (frame != null) {
                    Mat mat = converter.convert(frame);
                    if (mat != null) {
                        Mat flippedMat = new Mat();
                        flip(mat, flippedMat, 1);

                        synchronized (frameBuffer) {
                            if (frameBuffer.size() >= bufferSize) {
                                frameBuffer.pollFirst();
                            }
                            frameBuffer.addLast(new FrameData(flippedMat.clone(), LocalDateTime.now()));
                        }

                        File tempFile = saveImageToTempFile(flippedMat);

                        CheatingResult result = aiHttpService.detectCheating(userId, tempFile);
                        if (result != null) {
                            processCheatingResult(userId, sessionId, result);
                        }

                        tempFile.delete();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void processCheatingResult(Integer userId, Integer sessionId, CheatingResult result) {
        if (result != null && result.getCheatingCounts() != null && !result.getCheatingCounts().isEmpty()) {
            // 부정행위 발생 시점 파싱
            LocalDateTime cheatingTimestamp = LocalDateTime.parse(result.getTimestamp(), TIMESTAMP_FORMATTER);

            // 부정행위 유형 확인 및 처리
            result.getCheatingCounts().forEach((cheatingTypeName, currentCount) -> {
                try {
                    // 부정행위 유형 ID 매핑
                    Integer cheatingTypeId = cheatingTypeMappingService.getCheatingTypeId(cheatingTypeName);

                    // 기존 부정행위 횟수 조회
                    Integer previousCount = cheatingValidationService.getExistingCheatingCount(
                            userId, sessionId, cheatingTypeId
                    );

                    // 새로운 부정행위인지 확인
                    if (currentCount > (previousCount != null ? previousCount : 0)) {
                        // 새로운 부정행위 발생 -> 데이터 저장
                        cheatingValidationService.saveNewCheatingRecord(
                                userId, sessionId, cheatingTypeId, cheatingTimestamp
                        );

                        // 비디오 저장
                        saveClipToS3(cheatingTimestamp);
                    }
                } catch (IllegalArgumentException e) {
                    System.err.println("Unknown cheating type: " + cheatingTypeName);
                }
            });
        }
    }

    private File saveImageToTempFile(Mat mat) throws Exception {
        OpenCVFrameConverter.ToMat matConverter = new OpenCVFrameConverter.ToMat();
        Frame frame = matConverter.convert(mat);

        Java2DFrameConverter java2DConverter = new Java2DFrameConverter();
        BufferedImage bufferedImage = java2DConverter.convert(frame);

        BufferedImage downsampledImage = resizeImage(bufferedImage, 640, 360);

        String tempFileName = "temp-" + UUID.randomUUID() + ".jpg";
        File tempFile = new File(System.getProperty("java.io.tmpdir"), tempFileName);

        ImageIO.write(downsampledImage, "jpg", tempFile);

        return tempFile;
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, originalImage.getType());
        Graphics2D graphics = resizedImage.createGraphics();
        graphics.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        graphics.dispose();
        return resizedImage;
    }

    private String saveClipToS3(LocalDateTime cheatingTimestamp) {
        synchronized (frameBuffer) {
            try {
                LocalDateTime startTime = cheatingTimestamp.minusSeconds(15);
                LocalDateTime endTime = cheatingTimestamp.plusSeconds(15);

                Deque<Mat> clipFrames = new ArrayDeque<>();
                for (FrameData frameData : frameBuffer) {
                    if (!frameData.getTimestamp().isBefore(startTime) && !frameData.getTimestamp().isAfter(endTime)) {
                        clipFrames.add(frameData.getFrame());
                    }
                }

                String filePath = "detected_clip_" + cheatingTimestamp.toString().replace(":", "-") + ".mp4";
                s3Uploader.uploadVideo(clipFrames, filePath);
                System.out.println("Clip saved to S3: " + filePath);
                return filePath;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    private static class FrameData {
        private final Mat frame;
        private final LocalDateTime timestamp;

        public FrameData(Mat frame, LocalDateTime timestamp) {
            this.frame = frame;
            this.timestamp = timestamp;
        }

        public Mat getFrame() {
            return frame;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }
    }
}