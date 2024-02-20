'use client';

import { useDispatch, useSelector } from 'react-redux';
import { setReduxTimer } from '@/store/module/timer';
import { TimerState } from '@/type/type';
import axios from 'axios';

const useTimerFunc = () => {
  const dispatch = useDispatch();
  const { startPoint = 0, savedStudyTime = 0 } = useSelector((state: { timer: TimerState }) => state.timer);

  // 타이머 시작
  const startStudy = () => {
    const startPointTime = new Date().getTime();
    dispatch(setReduxTimer({ studyStatus: 'start', startPoint: startPointTime }));

    // 첫 시작일 때에만 요청
    if (!startPoint) {
      const sendData = async () => {
        try {
          // ADD: userid 추가해서 보내기
          await axios.post(`${process.env.NEXT_PUBLIC_URL}/feed/addfeed`, { startPoint: new Date() });
        } catch (error) {
          console.error('타이머 시작', error);
        }
      };

      // sendData();
    }
  };

  // [내 공부] 일시정지
  const pauseStudy = () => {
    const pausePoint = new Date().getTime();
    let timeDiff = pausePoint - startPoint;
    dispatch(setReduxTimer({ studyStatus: 'pause', savedStudyTime: savedStudyTime + timeDiff }));
  };

  // [내 공부] 정지
  const endStudy = async (sendToServer: boolean) => {
    dispatch(setReduxTimer({ studyStatus: 'end' }));
    const endPoint = new Date().getTime();
    const totalTime = Math.floor((savedStudyTime + endPoint - startPoint) / 60000);

    // ADD: userid 추가해서 보내기
    if (sendToServer) {
      const sendData = async () => {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_URL}/home/end`, { endPoint: new Date(), totalTime });
        } catch (error) {
          console.error('타이머 끝', error);
        }

        // sendData();
      };
    }
  };

  return { startStudy, pauseStudy, endStudy };
};

export default useTimerFunc;
