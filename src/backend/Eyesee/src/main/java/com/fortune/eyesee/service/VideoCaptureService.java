package com.fortune.eyesee.service;

import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Deque;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class VideoCaptureService {

    @Autowired
    private AIHttpService aiHttpService;
    @Autowired
    private CheatingService cheatingService;

    private final Deque<Mat> frameBuffer = new ConcurrentLinkedDeque<>();
    private static final int BUFFER_SIZE = 500; // 최대 프레임 버퍼 크기 (적절히 축소)
    private static final int FRAME_DROP_INTERVAL = 1; // 프레임 드롭 간격
    private final ExecutorService frameProcessingExecutor = Executors.newFixedThreadPool(4); // 병렬 스레드

    private int frameCounter = 0; // 프레임 카운터

    /**
     * WebRTC 데이터를 처리하고 AI 서버 호출
     */
    public void processWebRTCData(Integer userId, Integer sessionId, byte[] frameData) {
        frameCounter++;

        // 프레임 드롭: FRAME_DROP_INTERVAL에 해당하지 않으면 무시
        if (frameCounter % FRAME_DROP_INTERVAL != 0) {
            return;
        }

        // 스레드를 통해 처리
        frameProcessingExecutor.submit(() -> {
            try {
                // 프레임 변환 및 크기 조정
                Mat frameMat = convertToMatAndResize(frameData, 320, 180);

                // 프레임 버퍼에 추가
                synchronized (frameBuffer) {
                    if (frameBuffer.size() >= BUFFER_SIZE) {
                        frameBuffer.pollFirst(); // 오래된 프레임 제거
                    }
                    frameBuffer.addLast(frameMat);
                }

                // AI 서버 호출
                CheatingResult result = aiHttpService.processWebRTCData(userId, sessionId, frameData);
                if (result != null) {
                    cheatingService.processCheatingResult(userId, sessionId, result, frameBuffer);
                }
            } catch (Exception e) {
                System.err.println("Error processing WebRTC data: " + e.getMessage());
                e.printStackTrace();
            }
        });
    }

    /**
     * byte[] 데이터를 Mat로 변환하고 크기 조정
     */
    private Mat convertToMatAndResize(byte[] data, int targetWidth, int targetHeight) {
        // byte[] 데이터를 Mat으로 변환
        Mat encodedMat = new Mat(data.length, 1, org.bytedeco.opencv.global.opencv_core.CV_8UC1);
        encodedMat.data().put(data);

        // 디코딩하여 실제 Mat 생성
        Mat decodedMat = opencv_imgcodecs.imdecode(encodedMat, opencv_imgcodecs.IMREAD_COLOR);
        if (decodedMat == null || decodedMat.empty()) {
            throw new IllegalArgumentException("Failed to decode image data into Mat.");
        }

        // 크기 조정
        Mat resizedMat = new Mat();
        opencv_imgproc.resize(decodedMat, resizedMat, new org.bytedeco.opencv.opencv_core.Size(targetWidth, targetHeight));

        return resizedMat;
    }
}