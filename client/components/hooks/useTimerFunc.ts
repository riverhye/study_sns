'use client';

import { useDispatch, useSelector } from 'react-redux';
import { setReduxTimer } from '@/store/module/timer';
import { TimerState } from '@/type/type';
import axios from 'axios';
import { w3cwebsocket } from 'websocket';

const useTimerFunc = () => {
  const dispatch = useDispatch();
  const { startPoint = 0, savedStudyTime = 0 } = useSelector((state: { timer: TimerState }) => state.timer);

  // 타이머 시작
  const startStudy = (content: string) => {
    const startPointTime = new Date().getTime();
    dispatch(setReduxTimer({ studyStatus: 'start', startPoint: startPointTime }));

    const token = localStorage.getItem('accessToken');

    const ws = new w3cwebsocket(`ws://localhost:8080/socket?token=${token}`);

    ws.onerror = function (e) {
      console.log('Connection Error', e);
    };

    ws.onopen = function () {
      console.log('W3C WebSocket Client Connected');
      const play = { action: 'play' }; // + TODO : content
      ws.send(JSON.stringify(play));
      console.log('play send');
    };

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
  };

  // [내 공부] 일시정지
  const pauseStudy = () => {
    const pausePoint = new Date().getTime();
    let timeDiff = pausePoint - startPoint;
    dispatch(setReduxTimer({ studyStatus: 'pause', savedStudyTime: savedStudyTime + timeDiff }));
    // const sendData = async () => {
    //   try {
    //     const res = axios.post(`${process.env.NEXT_PUBLIC_URL}/home/pause`, {
    //       savedStudyTime: savedStudyTime + timeDiff,
    //     });
    //   } catch (error) {
    //     console.error('타이머 일시정지', error);
    //   }
    // };

    // sendData();
  };

  // [내 공부] 정지
  const endStudy = async (sendToServer: boolean) => {
    dispatch(setReduxTimer({ studyStatus: 'end' }));
    // const endPoint = new Date().getTime();
    // const totalTime = Math.floor((savedStudyTime + endPoint - startPoint) / 60000);

    // // ADD: userid 추가해서 보내기
    // if (sendToServer) {
    //   const sendData = async () => {
    //     try {
    //       await axios.post(`${process.env.NEXT_PUBLIC_URL}/home/end`, { endPoint: new Date(), totalTime });
    //     } catch (error) {
    //       console.error('타이머 끝', error);
    //     }

    //     // sendData();
    //   };
    // }
  };

  return { startStudy, pauseStudy, endStudy };
};

export default useTimerFunc;
