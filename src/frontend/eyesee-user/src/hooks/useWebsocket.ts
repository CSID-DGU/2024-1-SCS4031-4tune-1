"use client";

import { useEffect, useRef } from "react";
import { WebSocketClient } from "@/utils/websocket";

export const useWebSocket = (url: string) => {
  const client = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    client.current = new WebSocketClient(url);
    return () => {
      client.current?.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    client.current?.sendMessage(message);
  };

  const sendBinaryData = (data: ArrayBuffer) => {
    client.current?.sendBinaryData(data);
  };

  const connect = (
    onMessage: (message: MessageEvent) => void,
    onError: (error: Event) => void
  ) => {
    client.current?.connect(onMessage, onError);
  };

  return { connect, sendMessage, sendBinaryData };
};
