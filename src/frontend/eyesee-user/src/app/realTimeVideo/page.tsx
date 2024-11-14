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
      }
    } catch (error) {
      console.error("비디오 스트림 가져오기 오류:", error);
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
        canvas.toBlob(async (blob) => {
          if (blob) {
            // JPEG 이미지를 서버로 전송
            await sendImageToServer(blob);
          }
        }, "image/jpeg");
      }
    }
  };

  // Blob 데이터를 서버에 전송하는 함수
  const sendImageToServer = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("image", blob, "frame.jpg");

    try {
      const response = await fetch("/api/upload-image", {
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
    startStreaming();

    // 0.1초에 한 번씩 프레임 캡처 및 전송
    const captureInterval = setInterval(captureAndSendFrame, 100);
    return () => clearInterval(captureInterval);
  }, []);

  return (
    <div>
      <h1>실시간 JPEG 이미지 전송</h1>
      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default RealTimeVideoPage;
