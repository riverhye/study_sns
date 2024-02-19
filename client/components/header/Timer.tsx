import useTimer from '../hooks/useTimer';
import { useSelector } from 'react-redux';
import { TimerState } from '@/type/type';

const Timer = () => {
  const { studyStatus } = useSelector((state: { timer: TimerState }) => state.timer);
  const { hours, minutes, seconds } = useTimer(studyStatus);

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
