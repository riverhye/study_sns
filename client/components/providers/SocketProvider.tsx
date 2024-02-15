'use client';

import { useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

const socketTest: React.FC = () => {
  useEffect(() => {
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_LOCAL_URL}`);

    socket.on('connect', () => {
      console.log('소켓 연결');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};

// const socket:Socket = io.connect('http://localhost:8080', {autoConnect: false})
// const initSocketConnect = () => {
//   if(!socket.connected) socket.connect();
// };

export default socketTest;
