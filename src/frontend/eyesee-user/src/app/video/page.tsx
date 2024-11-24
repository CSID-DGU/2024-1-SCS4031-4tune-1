"use client";

import React, { useEffect, useRef, useState } from "react";

const VideoPage = () => {
  const userId = 1; // 임의 값

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const CAPTURE_INTERVAL = 1000; // 1초 간격으로 캡처
  const MAX_BASE64_SIZE = 64 * 1024; // 64KB

  const initializeWebSocket = () => {
    websocketRef.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_KEY}/${userId}`
    );
    // websocketRef.current = new WebSocket(`ws://localhost:8000/ws/${userId}`);

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      websocketRef.current?.send(`INIT ${userId}`);
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket connection closed. Reconnecting...");
      setIsConnected(false);
      setTimeout(() => initializeWebSocket(), 3000);
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocketRef.current.onmessage = (event) => {
      console.log("Received from server:", event.data);
    };
  };

  const sendBase64Data = async (canvas: HTMLCanvasElement) => {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.3)
    );

    if (blob) {
      const buffer = await blob.arrayBuffer();
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(buffer)));

      if (base64Data.length > MAX_BASE64_SIZE) {
        console.warn("Data size exceeds maximum limit. Skipping...");
        return;
      }

      console.log("Sending Base64 data size:", base64Data.length);
      websocketRef.current?.send(base64Data);
    }
  };

  const startStreaming = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;

        if (videoRef.current && canvasRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          const intervalId = setInterval(() => {
            if (ctx && videoRef.current) {
              canvas.width = 320;
              canvas.height = 180;
              ctx.save();
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(
                videoRef.current,
                0,
                0,
                canvas.width,
                canvas.height
              );
              ctx.restore();

              sendBase64Data(canvas);
            }
          }, CAPTURE_INTERVAL);

          setIsStreaming(true);

          return () => {
            clearInterval(intervalId);
            stream.getTracks().forEach((track) => track.stop());
          };
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  };

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
  };

  useEffect(() => {
    initializeWebSocket();

    return () => {
      websocketRef.current?.close();
    };
  }, [userId]);

  return (
    <div>
      <h3>{isConnected ? "WebSocket Connected" : "WebSocket Disconnected"}</h3>
      <div>
        <button
          onClick={isStreaming ? stopStreaming : startStreaming}
          style={{
            padding: "10px 20px",
            backgroundColor: isStreaming ? "red" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isStreaming ? "Stop Webcam" : "Start Webcam"}
        </button>
      </div>
      <video
        ref={videoRef}
        style={{ width: "100%", maxWidth: "640px", marginTop: "20px" }}
        autoPlay
        muted
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default VideoPage;
