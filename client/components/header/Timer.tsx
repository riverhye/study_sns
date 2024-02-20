import useTimer from '../hooks/useTimer';
import { useSelector } from 'react-redux';
import { TimerState } from '@/type/type';

const Timer = () => {
  const { studyStatus } = useSelector((state: { timer: TimerState }) => state.timer);
  const { hours, minutes, seconds } = useTimer(studyStatus);

  return (
    <>
      <div className="flex items-center">
        <div className="w-20 h-20 rounded-full border-2 md:w-10 md:h-10">
          <img src="" alt="" />
        </div>
        <div className="flex flex-col justify-center ml-3">
          <span className="text-white text-sm">닉네임</span>
          <div className="text-white text-2xl">
            {hours}:{minutes}:{seconds}
          </div>
        </div>
      </div>
    </>
  );
};

export default Timer;
