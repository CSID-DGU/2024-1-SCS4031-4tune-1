export class WebSocketClient {
  private socket: WebSocket | null = null;

  constructor(private url: string) {}

  connect(
    onMessage: (message: MessageEvent) => void,
    onError: (error: Event) => void
  ) {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
    };

    this.socket.onmessage = onMessage;

    this.socket.onerror = onError;

    this.socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not connected");
    }
  }

  sendBinaryData(data: ArrayBuffer) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      console.error("WebSocket is not connected");
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
