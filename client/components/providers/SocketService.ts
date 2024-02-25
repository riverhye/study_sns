import { w3cwebsocket } from 'websocket';

let socket: w3cwebsocket | null = null;

export const connectWebSocket = (): w3cwebsocket => {
  if (!socket) {
    const token = localStorage.getItem('accessToken');
    socket = new w3cwebsocket(`ws://localhost:8080/socket?token=${token}`);

    socket.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    socket.onerror = e => {
      console.log('Connection Error', e);
    };

    socket.onclose = () => {
      console.log('Connection Closed');
      socket = null;
    };
  }

  return socket!;
};

export const disconnectWebSocket = () => {
  if (socket && socket.readyState === socket.OPEN) {
    socket.close();
  }
};
