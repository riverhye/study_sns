import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetReduxTimer } from '@/store/module/timer';
import { TimerState } from '@/type/type';

const useTimer = (studyStatus: TimerState['studyStatus']) => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const timerTrigger = () => {
      if (studyStatus === 'start') {
        intervalRef.current = setInterval(() => {
          setTime(prevTime => prevTime + 1);
        }, 1000);
      } else {
        clearInterval(intervalRef.current);
        if (studyStatus === 'end') {
          setTime(0);
          dispatch(resetReduxTimer());
        }
      }
    };

    timerTrigger();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [studyStatus, dispatch]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const secondsPart = (seconds % 60).toString().padStart(2, '0');

    return { hours, minutes, seconds: secondsPart };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return { hours, minutes, seconds };
};

export default useTimer;
