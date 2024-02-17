import { useRef, useState } from 'react';

const Timer = () => {
  // 스톱워치 상태
  const [status, setStatus] = useState<string>('stop');
  // 실시간
  const [time, setTime] = useState<number>(0);
  // 시간 저장
  const [savedTime, setSavedTime] = useState<number>(0);
  // 상태가 변화하는 시각 관리
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 스톱워치 시작, 일시정지, 정지
  // 시작 : 현재 시각 계속 늘어나는 거 보여주기 + redux 저장/업뎃 + axios.post 요청
  // 일시정지 : 현재 시각 멈춤 + ( 일시정지한 시각 - 시작 시각) = savedTime에 저장 후 redux 업뎃
  // 정지 : 현재 시각 0으로 + (여지껏 savedTime + 정지 시각 - 시작 시각) = endTime & endpoint axios.post 요청 + redux 타이머 초기화
  const startStudy = () => {
    if (status === 'stop') {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1000);
      }, 1000);
      setStatus('start');
    } else if (status === 'pause') {
    }
  };

  return (
    <>
      <div className="flex">
        <div className="w-16 h-16 rounded-full border-2">
          <img src="" alt="" />
        </div>
        <div className="flex flex-col justify-center ml-6">
          <span>닉네임</span>
          <div className="text-2xl">00:00:00</div>
          <button className="text-sm">임시</button>
        </div>
      </div>
    </>
  );
};

export default Timer;
