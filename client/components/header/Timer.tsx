import useTimer from '../hooks/useTimer';
import { useSelector } from 'react-redux';
import { TimerState } from '@/type/type';
import Image from 'next/image';
import useTimerFunc from '../hooks/useTimerFunc';

const Timer = () => {
  const { studyStatus } = useSelector((state: { timer: TimerState }) => state.timer);
  const { hours, minutes, seconds } = useTimer(studyStatus);
  const { pauseStudy, endStudy } = useTimerFunc(); // temp
  const nickname = localStorage.getItem('nickname');

  return (
    <>
      <div className="flex items-center">
        {nickname ? (
          <>
            <div className="w-20 h-20 rounded-full border-2 overflow-hidden">
              <Image src="/blank-profile.png" priority={false} alt="user profile" width={300} height={300} />
            </div>
            <div className="flex flex-col justify-center ml-3">
              <span className="text-white text-sm ml-2 cursor-default">{nickname}</span>
              <div className="text-white text-2xl w-28 text-center cursor-default">
                <span className="w-8 inline-block">{hours}</span>:<span className="w-8 inline-block">{minutes}</span>:
                <span className="w-8 inline-block">{seconds}</span>
              </div>
            </div>
            <div>
              <button onClick={pauseStudy}>pause</button>
              <button onClick={() => endStudy(true)}>끝</button>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default Timer;
