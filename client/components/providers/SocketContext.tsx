import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { IMessageEvent, w3cwebsocket } from 'websocket';

interface WebSocketContextProps {
  socket: w3cwebsocket | null;
  connectWebSocket: () => boolean;
  disconnectWebSocket: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<w3cwebsocket | null>(null);

  const connectWebSocket = () => {
    const token = localStorage.getItem('accessToken');
    const newSocket = new w3cwebsocket(`ws://localhost:8080/socket?token=${token}`);

    newSocket.onopen = () => {
      console.log('WebSocket Client Connected');
      setSocket(newSocket);
      // if (socket) {
      //   try {
      //     const play = { action: 'play', studyContent: 'ddd' };

      //     socket.send(JSON.stringify(play));
      //     console.log('play send');

      //     socket.onmessage = evt => {
      //       console.log(1111111111111);
      //       // console.log( JSON.parse(evt.data))
      //       console.log('play data: ', evt.data);
      //       if (evt.data.slice(10, 13) === 'play') {
      //         // const res = JSON.parse(evt.data);
      //       }
      //     };
      //   } catch (error) {
      //     console.error('start socket', error);
      //   }
      // }
    };

    newSocket.onerror = (e: any) => {
      console.log('Connection Error', e);
    };

    newSocket.onclose = () => {
      console.log('Connection Closed');
      setSocket(null);
    };

    return true; // 연결 성공 여부 반환
  };

  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, connectWebSocket, disconnectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const socket = useContext(WebSocketContext);
  if (!socket) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return socket;
};
