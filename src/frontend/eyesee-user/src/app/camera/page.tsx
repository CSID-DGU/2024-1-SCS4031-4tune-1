"use client";

import NextButton from "@/components/common/NextButton";
import SubHeader from "@/components/common/SubHeader";
import { useRef, useEffect } from "react";

const CameraPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      alert("카메라 권한을 허용해주세요.");
    }
  };

  // 컴포넌트 마운트 시 비디오 스트림 시작
  useEffect(() => {
    startStreaming();
  }, []);

  return (
    <div className="p-4">
      <SubHeader title="카메라 확인" />

      <div className="flex flex-col items-center gap-4 mt-4">
        {/* 비디오 화면 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-[90vw] h-[60vh] object-cover border border-gray-300 rounded"
          style={{ transform: "scaleX(-1)" }} // 좌우 반전
        />
        <div className="text-sm text-gray-600">
          카메라가 정상적으로 작동하고 있는지 확인하세요.
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <NextButton
          action="/exam-room"
          title="시험장 접속"
          isAvailable={true}
        />
      </div>
    </div>
  );
};

export default CameraPage;
