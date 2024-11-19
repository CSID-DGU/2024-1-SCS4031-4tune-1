"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const VideoPage = () => {
  const userId = 123; // Example: Replace with dynamic value
  const sessionId = 456; // Example: Replace with dynamic value

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const CHUNK_SIZE = 8192;
  const CAPTURE_INTERVAL = 1000;

  const sendChunkedData = (buffer: ArrayBuffer, chunkSize: number) => {
    let offset = 0;

    while (offset < buffer.byteLength) {
      const chunk = buffer.slice(offset, offset + chunkSize);
      websocketRef.current?.send(chunk);
      offset += chunkSize;
    }
  };

  const initializeWebSocket = useCallback(() => {
    websocketRef.current = new WebSocket("ws://localhost:8080/ws/video");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      websocketRef.current?.send(`INIT ${userId} ${sessionId}`);
    };

    websocketRef.current.onmessage = (event) => {
      console.log("Received from server:", event.data);
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket connection closed. Reconnecting...");
      setTimeout(() => initializeWebSocket(), 3000);
    };
  }, [userId, sessionId]);

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

          const intervalId = setInterval(async () => {
            if (ctx && videoRef.current) {
              canvas.width = 640;
              canvas.height = 360;

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

              const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.5)
              );

              if (blob) {
                const buffer = await blob.arrayBuffer();
                console.log("Sending binary data size:", buffer.byteLength);

                if (buffer.byteLength > CHUNK_SIZE) {
                  sendChunkedData(buffer, CHUNK_SIZE);
                } else {
                  websocketRef.current?.send(buffer);
                }
              }
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
  }, [initializeWebSocket]);

  return (
    <div>
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
