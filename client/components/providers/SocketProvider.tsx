'use client';

import { useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

const socket: Socket = io(`${process.env.NEXT_PUBLIC_URL}`);
const socketConnection: React.FC = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('소켓 연결');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};

const handleStart = () => {
  // TODO: [Nav 타이머] 공부할 내용 입력 후 시작 클릭
  socket.emit('startPoint');
};

const handleStop = () => {
  // TODO: [Nav 타이머] 중지 클릭
  socket.emit('endPoint');
};

const handleLike = () => {
  // TODO: [알림] 피드 좋아요 클릭
  socket.emit('like');
};

// const socket:Socket = io.connect('http://localhost:8080', {autoConnect: false})
// const initSocketConnect = () => {
//   if(!socket.connected) socket.connect();
// };

export default socketConnection;
