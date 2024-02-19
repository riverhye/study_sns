import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TimerState } from '@/type/type';
import { resetReduxTimer } from '@/store/module/timer';

const Timer = () => {
  const dispatch = useDispatch();
  const { studyStatus } = useSelector((state: { timer: TimerState }) => state.timer);

  // 실시간
  const [time, setTime] = useState(0);
  // 상태가 변화하는 시각 관리
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
  }, [studyStatus]);

  return (
    <>
      <div className="flex">
        <div className="w-16 h-16 rounded-full border-2">
          <img src="" alt="" />
        </div>
        <div className="flex flex-col justify-center ml-6">
          <span>닉네임</span>
          <div className="text-2xl">
            {hours}:{minutes}:{seconds}
          </div>
        </div>
      </div>
    </>
  );
};

export default Timer;
