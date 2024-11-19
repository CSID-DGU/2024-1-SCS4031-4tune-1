package com.fortune.eyesee.utils;

import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_videoio.VideoWriter;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Deque;

@Component
public class S3Uploader {

    public void uploadVideo(Deque<Mat> frames, String filePath) {
        try {
            System.out.println("Saving video at: " + filePath);
            // 로컬에 비디오 파일 저장 하거나
            // 실제 S3 업로드 로직 추가
        } catch (Exception e) {
            System.err.println("Error uploading video: " + e.getMessage());
            e.printStackTrace();
        }
    }
}