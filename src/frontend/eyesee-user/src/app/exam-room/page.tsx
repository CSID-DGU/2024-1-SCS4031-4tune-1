"use client";

import React, { useEffect, useRef, useState } from "react";
import NextButton from "@/components/common/NextButton";
import { useUserStore } from "@/store/useUserStore";
import { useStore } from "@/store/useStore";

const RealTimeVideoPage = () => {
  // 수험자 실시간 화면이 담기는 공간
  const videoRef = useRef<HTMLVideoElement>(null);

  // 캠버스에서 프레임을 캡쳐
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 웹소켓 연결 관리
  const socketRef = useRef<WebSocket | null>(null);

  // 실시간 비디오 녹화
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // 미디어 스트림을 저장
  const streamRef = useRef<MediaStream | null>(null);

  // 녹화된 비디오 데이터를 청크 단위로 저장
  const recordedChunksRef = useRef<Blob[]>([]);
  const captureIntervalRef = useRef<number | null>(null);

  const userId = useStore(useUserStore, (state) => state.userId);
  const examId = useStore(useUserStore, (state) => state.examId);

  const setupWebSocket = () => {
    console.log(process.env.NEXT_PUBLIC_WEBSOCKET_KEY);
    console.log(userId, examId);
    if (!userId) {
      console.log("userId가 설정되지 않았습니다.");
      return;
    }

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_KEY}/${userId}/${examId}`
    );

    socket.onopen = () => {
      console.log(`WebSocket 연결 성공: ${userId}, ${examId}`);
    };

    socket.onerror = (error) => {
      console.error("WebSocket 오류 발생:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket 연결 종료. 재연결 시도 중", event.reason);
      setTimeout(setupWebSocket, 3000);
    };

    // 부정행위 감지 메시지 처리
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket 메시지 수신:", message);

      // 부정행위 감지 메시지가 있을 경우
      if (message) {
        console.log("부정행위 감지:", message.timestamp);
        startRecordingForCheating(); // 부정행위 비디오 저장 함수 호출
      }
    };

    socketRef.current = socket;
  };

  const startStreaming = async () => {
    try {
      const constraints = { video: true, audio: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error("비디오 스트림 가져오기 오류:", error);
      throw error;
    }
  };

  // Canvas를 사용해 비디오 프레임을 WebSocket으로 전송
  const startRecording = (stream: MediaStream) => {
    recordedChunksRef.current = []; // 기존 청크 초기화

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      if (recordedChunksRef.current.length > 0) {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `cheating_${new Date().toISOString()}.webm`;
        a.click();

        console.log(`비디오 크기: ${blob.size / 1024} KB`);
        console.log("부정행위 비디오 저장 완료");
      }
    };

    mediaRecorderRef.current.start();
  };

  const startRecordingForCheating = async () => {
    try {
      // 이미 녹화 중이면 기존 녹화 중지
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }

      // 스트림이 없으면 새로 생성
      const stream = streamRef.current || (await startStreaming());

      // 5초간 녹화
      startRecording(stream);

      // 5초 후 녹화 중지
      setTimeout(() => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
      }, 5000);
    } catch (error) {
      console.error("부정행위 이벤트 처리 중 오류", error);
    }
  };

  const captureAndSendFrame = () => {
    if (
      canvasRef.current &&
      videoRef.current &&
      socketRef.current?.readyState === WebSocket.OPEN
    ) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64Data = canvas.toDataURL("image/jpeg", 0.3);
        const base64String = base64Data.split(",")[1];

        socketRef.current.send(base64String);
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setupWebSocket();
        await startStreaming();

        captureIntervalRef.current = window.setInterval(
          captureAndSendFrame,
          500
        );
      } catch (error) {
        console.error("초기화 중 오류:", error);
      }

      return () => {
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
        }

        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }

        if (socketRef.current) {
          socketRef.current.close();
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
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
        style={{ transform: "scaleX(-1)" }}
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
