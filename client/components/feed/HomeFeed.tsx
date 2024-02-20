'use client';

import axios from 'axios';
import { UserFeedData, TimerState } from '@/type/type';
import { useEffect, useState } from 'react';
import UpdateFeed from './UpdateFeed';
import FeedContent from './FeedContent';
import useTimerFunc from '../hooks/useTimerFunc';

const HomeFeed = () => {
  const initialFeedData: UserFeedData[] = [
    { nickname: '테스트', image: 'image', content: '작성 내용', type: '시작했습니다.', date: new Date(), isLike: true },
    {
      nickname: '어쩌고',
      content: '리액트',
      type: '시작했습니다.',
      image: 'image',
      date: new Date('2024-02-19T12:34:56'),
      isLike: true,
    },
    {
      nickname: '맞는데요',
      image: 'image2',
      content: '게임',
      type: '마쳤습니다.',
      date: new Date('2024-02-14T12:34:56'),
      isLike: false,
    },
  ];
  const [feedData, setFeedData] = useState<UserFeedData[]>(initialFeedData);
  const [likeFeed, setLikeFeed] = useState<boolean[]>([]);
  const { startStudy, pauseStudy, endStudy } = useTimerFunc();

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
      // Add: userId
      const res = await axios.get<UserFeedData[]>(`${process.env.NEXT_PUBLIC_URL}/getfeed/userId`);
      // 내림차순 정렬
      const sortedFeedData = res.data.slice().sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
      });
      setFeedData(sortedFeedData);
    } catch (error) {
      console.error('새 피드', error);
    }
  };

  // 피드 좋아요
  const handleLike = async (index: number) => {
    try {
      // TODO : socket emit, UI 변경
      // 백에 넘길 거 : userid, content,
      // 받을 거 : nickname, profileImage, isLike, date(startPoint or endPoint or followPoint)
      setLikeFeed(() => {
        const newLike = [...likeFeed];
        newLike[index] = !newLike[index];
        return newLike;
      });
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/like/addlike`);
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
          <button onClick={() => endStudy(true)}>(임시)끝</button>
        </div>
        <UpdateFeed handleUpdateFeed={handleUpdateFeed} />
        <FeedContent initialFeedData={initialFeedData} feedData={feedData} handleLike={handleLike} />
      </section>
    </>
  );
};

export default HomeFeed;
