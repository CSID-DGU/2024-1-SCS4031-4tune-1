"use client";

import React, { useEffect, useRef } from "react";

const RealTimeVideoPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 비디오 스트림 가져오기
  const startStreaming = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("비디오 스트림 시작");
      }
    } catch (error) {
      console.error("비디오 스트림 가져오기 오류:", error);
      alert("카메라 권한을 허용해주세요.");
    }
  };

  // Canvas를 사용해 비디오 프레임을 JPEG로 캡처하고 서버에 전송
  const captureAndSendFrame = async () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Canvas 크기를 비디오와 동일하게 설정
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Canvas에 현재 비디오 프레임 그리기
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 캡처된 Canvas를 JPEG Blob으로 변환
        canvas.toBlob(
          async (blob) => {
            if (blob) {
              // JPEG 이미지를 서버로 전송
              await sendImageToServer(blob);
            }
          },
          "image/jpeg",
          0.7
        ); // 품질 70%
      }
    }
  };

  // Blob 데이터를 서버에 전송하는 함수
  const sendImageToServer = async (blob: Blob) => {
    const formData = new FormData();

    // JSON 데이터 생성
    const cheatingData = {
      sessionId: 456, // 세션 ID
      userId: 123, // 사용자 ID
      startTime: new Date().toISOString(), // 부정행위 발생 시간
    };

    // FormData에 이미지 및 JSON 추가
    formData.append("image", blob, "frame.jpg");
    formData.append("data", JSON.stringify(cheatingData)); // JSON 데이터 추가

    try {
      const response = await fetch("/video-recording/start", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("이미지 전송 오류");
      }
      console.log("이미지 전송 성공");
    } catch (error) {
      console.error("이미지 전송 실패:", error);
    }
  };

  // 비디오 스트리밍 시작 및 일정 간격으로 프레임 캡처
  useEffect(() => {
    const initialize = async () => {
      await startStreaming();
      // 0.5초에 한 번씩 프레임 캡처 및 전송
      const captureInterval = setInterval(captureAndSendFrame, 500);
      return () => clearInterval(captureInterval);
    };

    initialize();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-screen h-screen object-cover border border-gray-300"
        style={{ transform: "scaleX(-1)" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default RealTimeVideoPage;
