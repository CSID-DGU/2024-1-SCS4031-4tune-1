//package com.fortune.eyesee.controller;
//
//import org.bytedeco.javacv.CanvasFrame;
//import org.bytedeco.javacv.Frame;
//import org.bytedeco.javacv.FrameGrabber;
//import org.bytedeco.javacv.OpenCVFrameConverter;
//import org.bytedeco.opencv.opencv_core.Mat;
//
//import static org.bytedeco.opencv.global.opencv_core.flip;
//
//public class WebcamCaptureController {
//    public static void main(String[] args) {
//        try (FrameGrabber grabber = FrameGrabber.createDefault(0)) {
//            grabber.start();
//
//            OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
//            CanvasFrame canvas = new CanvasFrame("Webcam Capture - Mirrored");
//            canvas.setDefaultCloseOperation(javax.swing.JFrame.EXIT_ON_CLOSE);
//
//            while (canvas.isVisible()) {
//                Frame frame = grabber.grab();
//                Mat mat = converter.convert(frame);
//
//                if (mat != null) {
//                    Mat flippedMat = new Mat();
//                    flip(mat, flippedMat, 1);
//
//                    canvas.showImage(converter.convert(flippedMat));
//                }
//            }
//            grabber.stop();
//            canvas.dispose();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//}
package com.fortune.eyesee.controller;

import org.bytedeco.javacv.CanvasFrame;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.FrameGrabber;
import org.bytedeco.javacv.OpenCVFrameConverter;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

import static org.bytedeco.opencv.global.opencv_core.flip;

public class WebcamCaptureController {

    private static final String AI_SERVER_URL = "http://localhost:5001/analyze"; // AI 서버 URL

    public static void main(String[] args) {
        try (FrameGrabber grabber = FrameGrabber.createDefault(0)) {
            grabber.start();

            OpenCVFrameConverter.ToMat converterToMat = new OpenCVFrameConverter.ToMat();
            Java2DFrameConverter converterToBufferedImage = new Java2DFrameConverter();
            CanvasFrame canvas = new CanvasFrame("Webcam Capture - Mirrored");
            canvas.setDefaultCloseOperation(javax.swing.JFrame.EXIT_ON_CLOSE);

            while (canvas.isVisible()) {
                Frame frame = grabber.grab();
                Mat mat = converterToMat.convert(frame);

                if (mat != null) {
                    Mat flippedMat = new Mat();
                    flip(mat, flippedMat, 1);

                    // 캡처된 프레임을 AI 서버로 전송
                    sendFrameToAI(flippedMat, converterToBufferedImage);

                    // 캡처된 이미지를 화면에 표시
                    canvas.showImage(converterToMat.convert(flippedMat));
                }
            }
            grabber.stop();
            canvas.dispose();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void sendFrameToAI(Mat mat, Java2DFrameConverter converterToBufferedImage) {
        try {
            // Mat 객체를 Frame으로 변환 후 BufferedImage로 변환
            Frame frame = new OpenCVFrameConverter.ToMat().convert(mat);
            BufferedImage bufferedImage = converterToBufferedImage.convert(frame);

            // BufferedImage를 Base64로 인코딩
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "jpg", baos);
            String base64Image = Base64.getEncoder().encodeToString(baos.toByteArray());

            // HTTP 요청 생성
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // JSON 형태로 전송
            String jsonPayload = "{\"image\":\"" + base64Image + "\"}";
            HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);

            // AI 서버로 전송
            String response = restTemplate.postForObject(AI_SERVER_URL, request, String.class);
            System.out.println("AI Server Response: " + response);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
