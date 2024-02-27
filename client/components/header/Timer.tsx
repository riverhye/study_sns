import useTimer from '../hooks/useTimer';
import { useSelector } from 'react-redux';
import { TimerState } from '@/type/type';
import Image from 'next/image';
import useTimerFunc from '../hooks/useTimerFunc';
import HeaderIcons from '@/public/images/HeaderIcons';

const Timer = () => {
  const { studyStatus } = useSelector((state: { timer: TimerState }) => state.timer);
  const { hours, minutes, seconds } = useTimer(studyStatus);
  const { startStudy, pauseStudy, endStudy } = useTimerFunc();
  const { StartIcon, PauseIcon, StopIcon } = HeaderIcons;
  const nickname = localStorage.getItem('nickname');

  return (
    <>
      <div className="flex items-center">
        <div className="w-20 h-20 rounded-full border-2 overflow-hidden">
          <Image src="/blank-profile.png" priority={false} alt="user profile" width={300} height={300} />
        </div>
        <div className="flex flex-col justify-center ml-2">
          <span className="text-white text-sm ml-2 cursor-default">{nickname}</span>
          <div className="text-white text-2xl w-28 text-center cursor-default">
            <span className="w-8 inline-block">{hours}</span>:<span className="w-8 inline-block">{minutes}</span>:
            <span className="w-8 inline-block">{seconds}</span>
          </div>
        </div>
        <div className="flex-1">
          {/* 공부 상태에 따라 타이머 버튼 보이기 */}
          {studyStatus === 'start' && (
            <>
              <div className="mb-1 ml-1 hover:scale-125 cursor-pointer">
                <PauseIcon onClick={pauseStudy} />
              </div>
              <div className="ml-1 hover:scale-125 cursor-pointer">
                <StopIcon onClick={() => endStudy(true)} />
              </div>
            </>
          )}
          {studyStatus === 'pause' && (
            <>
              <div className="mb-1 ml-1 hover:scale-125 transition cursor-pointer">
                <StartIcon onClick={() => startStudy('')} />
              </div>
              <div className="ml-1 hover:scale-125 cursor-pointer">
                <StopIcon onClick={() => endStudy(true)} />
              </div>
            </>
          )}
          {studyStatus === '' && <div className=" w-[23px]"></div>}
        </div>
      </div>
    </>
  );
};

export default Timer;
