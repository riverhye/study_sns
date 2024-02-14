'use client';

import LoginButton from '@/components/login-button';
import { useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

const socketTest: React.FC = () => {
  useEffect(() => {
    const socket: Socket = io('http://localhost:8080');

    socket.on('connect', () => {
      console.log('소켓 연결');
    });

    return () => {
      socket.disconnect();
    };
  }, []);
};

// const socket:Socket = io.connect('http://localhost:8080', {autoConnect: false})
// const initSocketConnect = () => {
//   if(!socket.connected) socket.connect();
// };

export default function HomePage() {
  return <LoginButton />;
}
