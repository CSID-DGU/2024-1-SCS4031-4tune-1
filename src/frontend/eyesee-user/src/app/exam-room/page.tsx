"use client";

import React, { useEffect, useRef } from "react";
import NextButton from "@/components/common/NextButton";
import { useUserIdStore } from "@/store/useUserIdStore";
import { useStore } from "@/store/useStore";

const RealTimeVideoPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const userId = useStore(useUserIdStore, (state) => state.userId);

  const setupWebSocket = () => {
    if (!userId) {
      console.error(
        "userId가 설정되지 않았습니다. WebSocket 연결을 중단합니다."
      );
      return;
    }

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_KEY}/${userId}`
      // `${
      //   process.env.NEXT_PUBLIC_WEBSOCKET_KEY || "wss://43.201.224.93:8000/ws"
      // }/${userId}`
    );

    socket.onopen = () => {
      console.log(`WebSocket 연결 성공: ${userId}`);
    };
    socket.onerror = (error) => {
      console.error("WebSocket 오류 발생:", error);
    };
    socket.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    socketRef.current = socket;
  };

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

  // 시작 시점에 API 호출 - 추후 추가 예정
  /*
  const callStartRecordingApi = async () => {
    // JSON 데이터 생성
    const examData = {
      userId: 123, // 사용자 ID
      sessionId: 456, // 세션 ID
      startTime: new Date().toISOString(), // 부정행위 발생 시간
    };

    try {
      const response = await api.post("/video-recording/start", examData);
      console.log("시작 API 호출 성공:", response.data);
    } catch (error) {
      console.error("시작 API 호출 실패:", error);
    }
  };
*/
  // Canvas를 사용해 비디오 프레임을 WebSocket으로 전송
  const captureAndSendFrame = () => {
    if (
      canvasRef.current &&
      videoRef.current &&
      socketRef.current?.readyState === WebSocket.OPEN
    ) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Canvas 크기를 비디오와 동일하게 설정
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Canvas에 현재 비디오 프레임 그리기
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 캡처된 Canvas를 Base64로 변환
        const base64Data = canvas.toDataURL("image/jpeg", 0.7); // 품질 70%
        const base64String = base64Data.split(",")[1]; // "data:image/jpeg;base64," 부분 제거

        if (socketRef.current) {
          socketRef.current.send(base64String);
          console.log("Base64 이미지 전송");
        }
      }
    }
  };

  // 초기화 작업: WebSocket 연결, 비디오 스트리밍 시작, 시작 API 호출
  useEffect(() => {
    const initialize = async () => {
      // await callStartRecordingApi(); // 시작 API 호출

      if (!userId) {
        console.error("userId가 설정되지 않았습니다. 초기화를 중단합니다.");
        return;
      }

      setupWebSocket();
      await startStreaming();

      // 0.5초에 한 번씩 프레임 캡처 및 전송
      const captureInterval = setInterval(captureAndSendFrame, 500);

      return () => {
        clearInterval(captureInterval);

        // WebSocket 연결 종료
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    };

    initialize();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-screen h-screen object-cover border border-gray-300"
        style={{ transform: "scaleX(-1)" }} // 좌우 반전
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="fixed bottom-6 right-6">
        <NextButton
          action="/"
          title="시험 종료"
          isAvailable={true}
          noArrow={true}
        />
      </div>
    </div>
  );
};

export default RealTimeVideoPage;
