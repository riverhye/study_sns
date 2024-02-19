'use client';

import axios from 'axios';
import { UserFeedData, TimerState } from '@/type/type';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReduxTimer } from '@/store/module/timer';
import UpdateFeed from './UpdateFeed';
import FeedContent from './FeedContent';

const HomeFeed = () => {
  const initialFeedData: UserFeedData[] = [
    { nickname: '테스트', image: 'image', content: '작성 내용', type: '시작했습니다.', date: new Date() },
    {
      nickname: '어쩌고',
      content: '리액트',
      type: '시작했습니다.',
      image: 'image',
      date: new Date('2024-02-18T12:34:56'),
    },
    {
      nickname: '맞는데요',
      image: 'image2',
      content: '게임',
      type: '마쳤습니다.',
      date: new Date('2024-02-14T12:34:56'),
    },
  ];
  const [feedData, setFeedData] = useState<UserFeedData[]>(initialFeedData);

  // 접속 시 팔로워들의 공부 시작/끝, 나를 새 팔로우, 나를 좋아요 한 가져오기
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get<UserFeedData[]>(`${process.env.NEXT_PUBLIC_URL}/feed`);
        setFeedData(res.data);
      } catch (err) {
        console.error('피드 데이터', err);
      }
    };
    // getData();
  }, []);

  // 피드 새로고침
  const handleUpdateFeed = async () => {
    try {
      const res = await axios.get<UserFeedData[]>(`${process.env.NEXT_PUBLIC_URL}/feed/new`);
      // 내림차순 정렬
      const sortedFeedData = res.data.slice().sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
      });
      setFeedData(sortedFeedData);
    } catch (error) {
      console.error('새 피드', error);
    }
  };

  // 타이머
  const dispatch = useDispatch();
  const {
    studyStatus,
    startPoint = 0,
    savedStudyTime = 0,
  } = useSelector((state: { timer: TimerState }) => state.timer);

  // 시작
  const startStudy = () => {
    const startPointTime = new Date().getTime();
    dispatch(setReduxTimer({ studyStatus: 'start', startPoint: startPointTime }));

    // 첫 시작일 때에만 요청
    if (!startPoint) {
      const sendData = async () => {
        try {
          // ADD: userid 추가해서 보내기
          await axios.post(`${process.env.NEXT_PUBLIC_URL}/home/start`, { startPoint: new Date() });
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
  const endStudy = () => {
    dispatch(setReduxTimer({ studyStatus: 'end' }));
    const endPoint = new Date().getTime();
    const totalTime = Math.floor((savedStudyTime + endPoint - startPoint) / 60000);

    // ADD: userid 추가해서 보내기
    const sendData = async () => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_URL}/home/end`, { endPoint: new Date(), totalTime });
      } catch (error) {
        console.error('타이머 끝', error);
      }

      // sendData();
    };
  };

  // 피드 좋아요
  const handleLike = async (index: number) => {
    try {
      // TODO : socket emit, UI 변경
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/feed`);
    } catch (error) {
      console.error('피드 좋아요', error);
    }
  };

  return (
    <>
      <section>
        <div className="flex justify-center h-12 w-full">
          <input className="w-1/2 outline-none rounded-md shadow-sm block indent-3 focus:outline-none focus:ring-sky-500 focus:ring-1 focus:border-sky-500  placeholder:text-slate-400" />
          <button onClick={startStudy} type="button" className="w-32 border-2 rounded-full">
            시작
          </button>
          <button onClick={pauseStudy}>(임시)일시정지</button>
          <button onClick={endStudy}>(임시)끝</button>
        </div>
        <UpdateFeed handleUpdateFeed={handleUpdateFeed} />
        <FeedContent initialFeedData={initialFeedData} feedData={feedData} handleLike={handleLike} />
      </section>
    </>
  );
};

export default HomeFeed;
