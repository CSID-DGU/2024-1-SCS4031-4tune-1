"use client";

import React, { useEffect, useRef, useState } from "react";
import NextButton from "@/components/common/NextButton";
import { useUserIdStore } from "@/store/useUserIdStore";
import { useStore } from "@/store/useStore";

const RealTimeVideoPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<{ timestamp: number; data: Blob }[]>([]); // 청크와 타임스탬프 저장
  const captureIntervalRef = useRef<number | null>(null);

  const CHUNK_SIZE = 1000; // 1초마다 녹화 데이터를 저장
  const BUFFER_DURATION = 20 * 1000; // 20초 간의 데이터를 저장

  const [isProcessing, setIsProcessing] = useState(false); // 부정행위 감지 처리 중 여부 상태

  const userId = useStore(useUserIdStore, (state) => state.userId);
  const examId = 1;
  const setupWebSocket = () => {
    console.log(process.env.NEXT_PUBLIC_WEBSOCKET_KEY);
    console.log(userId);

    if (!userId) {
      console.error("userId가 설정되지 않았습니다.");
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
      setTimeout(setupWebSocket, 3000); // 3초 후 재시도
    };

    // 부정행위 감지 메시지 처리
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket 메시지 수신:", message);

      // 부정행위 감지 메시지가 있을 경우
      if (message) {
        console.log("부정행위 감지:", message.timestamp);

        // 부정행위 비디오 저장 호출
        sendCheatingVideo(message.timestamp);
      }
    };

    socketRef.current = socket;
  };

  const startStreaming = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("비디오 스트림 시작");
      }

      startRecording(stream); // 비디오 스트림과 함께 녹화 시작
    } catch (error) {
      console.error("비디오 스트림 가져오기 오류:", error);
      alert("카메라 권한을 허용해주세요.");
    }
  };

  // Canvas를 사용해 비디오 프레임을 WebSocket으로 전송
  const startRecording = (stream: MediaStream) => {
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp8",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const timestamp = Date.now();
        recordedChunksRef.current.push({
          timestamp: timestamp,
          data: event.data,
        });

        // 슬라이딩 윈도우 방식으로 오래된 데이터 삭제
        const currentTime = Date.now();
        recordedChunksRef.current = recordedChunksRef.current.filter(
          (chunk) => chunk.timestamp >= currentTime - BUFFER_DURATION
        );
      }
    };

    mediaRecorderRef.current.onerror = (e) => {
      console.error("MediaRecorder 오류 발생:", e);
    };

    mediaRecorderRef.current.start(CHUNK_SIZE); // **녹화 시작**
    console.log("MediaRecorder 시작");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log("MediaRecorder 중지");
    }
  };

  // 부정행위 비디오 처리 및 저장
  const sendCheatingVideo = async (
    cheatingTimestamp: string | number | Date
  ) => {
    try {
      setIsProcessing(true); // 부정행위 감지 시작

      console.log("부정행위 발생 타임스탬프:", cheatingTimestamp);

      const cheatingDate = new Date(cheatingTimestamp);
      if (isNaN(cheatingDate.getTime())) {
        throw new Error("Invalid cheatingTimestamp: " + cheatingTimestamp);
      }

      const cheatingTime = cheatingDate.getTime();
      const startTime = cheatingTime - 5000; // 부정행위 5초 전
      const endTime = cheatingTime + 5000; // 부정행위 5초 후

      console.log("탐지 이후 5초 데이터를 수집 중...");
      setTimeout(() => {
        mediaRecorderRef.current?.stop();
      }, 5000);

      // MediaRecorder가 멈춘 후 데이터를 처리
      mediaRecorderRef.current!.onstop = () => {
        const previousChunks = recordedChunksRef.current.filter(
          (chunk) =>
            chunk.timestamp >= startTime && chunk.timestamp <= cheatingTime
        );
        console.log(`탐지 이전 데이터: ${previousChunks.length} 청크`);

        const postCheatingChunks = recordedChunksRef.current.filter(
          (chunk) =>
            chunk.timestamp > cheatingTime && chunk.timestamp <= endTime
        );
        console.log(`탐지 이후 데이터: ${postCheatingChunks.length} 청크`);

        const allChunks = [...previousChunks, ...postCheatingChunks];
        const blob = new Blob(
          allChunks.map((chunk) => chunk.data),
          {
            type: "video/webm",
          }
        );

        console.log(`최종 Blob 크기: ${blob.size / 1024} KB`);

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cheating_${new Date().toISOString()}.webm`;
        a.click();
        URL.revokeObjectURL(url);

        console.log("부정행위 비디오 저장 완료");
        // 이 부분은 녹화가 중지된 후, 데이터가 완전히 처리된 후에 실행되어야 합니다.
        startRecording(videoRef.current?.srcObject as MediaStream);
      };
    } catch (error) {
      console.error("부정행위 이벤트 처리 중 오류:", error);
    } finally {
      setIsProcessing(false); // 부정행위 처리 끝
      console.log(isProcessing);
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
        console.log("WebSocket으로 프레임 전송");
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setupWebSocket();
      await startStreaming();

      //  0.5초에 한 번씩 프레임 캡처 및 전송
      captureIntervalRef.current = window.setInterval(captureAndSendFrame, 500);

      return () => {
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
        }

        stopRecording();
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
