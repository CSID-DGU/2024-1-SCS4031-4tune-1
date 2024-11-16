package com.fortune.eyesee.utils;

import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Deque;

@Component
public class S3Uploader {

    public void uploadVideo(Deque<Mat> frames, String filePath) {
        try {
            File videoFile = new File(filePath);
            try (FileOutputStream fos = new FileOutputStream(videoFile)) {
                for (Mat frame : frames) {
                    fos.write(frame.data().getStringBytes());
                }
            }
            // 여기에 S3 업로드 로직 추가
            System.out.println("Video uploaded to S3: " + filePath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}