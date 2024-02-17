'use client';

import React, { useEffect, useState } from 'react';

// --- 소켓 io ---
//import { Socket, io } from 'socket.io-client';
// const [message, setMessage] = useState<string>('');
// const socket: Socket = io(`${process.env.NEXT_PUBLIC_URL}`);
// const socketConnection: React.FC = () => {
//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('소켓 연결');
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return null;
// };

//   const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setMessage(event.target.value);
//   };

//     const sendMessage = () => {
//       socket.emit(message);
//     console.log('전송 완');
//   };

const SocketTest: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const websocket = new WebSocket('ws://localhost:8080/socket');
      setWs(websocket);

      websocket.onopen = function (event) {
        console.log('WebSocket Opened');
      };

      websocket.onmessage = function (event) {
        console.log('Message got: ' + event.data);
      };

      websocket.onclose = function (event) {
        console.log('WebSocket Closed.');
      };

      // websocket.onerror = err => {
      //   console.log('error', err);
      // };

      return () => {
        websocket.close();
      };
    }
  }, []);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log('전송 완');
    }
  };

  return (
    <div>
      <h1>WebSocket 페이지</h1>
      <input type="text" value={message} onChange={handleMessageChange} />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default SocketTest;
