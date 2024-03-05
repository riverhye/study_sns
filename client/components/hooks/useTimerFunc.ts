'use client';

import { useDispatch, useSelector } from 'react-redux';
import { setReduxTimer } from '@/store/module/timer';
import { TimerState } from '@/type/type';
import { useWebSocket } from '../providers/SocketContext';

const useTimerFunc = () => {
  const dispatch = useDispatch();
  const { startPoint = 0, savedStudyTime = 0 } = useSelector((state: { timer: TimerState }) => state.timer);

  const { socket } = useWebSocket();

  // 타이머 시작
  const startStudy = (content: string) => {
    const startPointTime = new Date().getTime();
    dispatch(setReduxTimer({ studyStatus: 'start', startPoint: startPointTime }));

    // 소켓을 통해 서버로 데이터 전송
    if (socket) {
      try {
        const play = { action: 'play', studyContent: content };
        socket.send(JSON.stringify(play));
      } catch (error) {
        console.error('start socket', error);
      }
    }
  };

  // const token = localStorage.getItem('accessToken');

  // const ws = new w3cwebsocket(`ws://localhost:8080/socket?token=${token}`);

  // ws.onerror = function (e) {
  //   console.log('Connection Error', e);
  // };

  // ws.onopen = function () {
  //   console.log('W3C WebSocket Client Connected');
  //   const play = { action: 'play' }; // + TODO : content
  //   ws.send(JSON.stringify(play));
  //   console.log('play send');
  // };

  // ws.onclose = () => {
  //   console.log('connection closed');
  // };

  // // 첫 시작일 때에만 요청
  // if (!startPoint) {
  //   const sendData = async () => {
  //     try {
  //       // ADD: userid 추가해서 보내기
  //       await axios.post(
  //         `${process.env.NEXT_PUBLIC_URL}/feed/addfeed`,
  //         { startPoint: new Date(), content },
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //     } catch (error) {
  //       console.error('타이머 시작', error);
  //     }
  //   };

  //   sendData();
  // }

  // [내 공부] 일시정지
  const pauseStudy = () => {
    const pausePoint = new Date().getTime();
    let timeDiff = pausePoint - startPoint;
    dispatch(setReduxTimer({ studyStatus: 'pause', savedStudyTime: savedStudyTime + timeDiff }));

    // 소켓을 통해 서버로 데이터 전송
    if (socket) {
      try {
        const pause = { action: 'pause' };
        socket.send(JSON.stringify(pause));
      } catch (error) {
        console.error('pause timer', error);
      }
    }
  };

  // [내 공부] 정지
  const endStudy = async () => {
    dispatch(setReduxTimer({ studyStatus: 'end' }));

    // 소켓을 통해 서버로 데이터 전송
    try {
      if (socket) {
        const stop = { action: 'stop' };
        socket.send(JSON.stringify(stop));
      }
    } catch (error) {
      console.error('stop timer', error);
    }
  };

  return { startStudy, pauseStudy, endStudy };
};

export default useTimerFunc;
