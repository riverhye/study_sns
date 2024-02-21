'use client';

import axios from 'axios';
import { UserFeedData, TimerState } from '@/type/type';
import { useEffect, useState } from 'react';
import UpdateFeed from './UpdateFeed';
import FeedContent from './FeedContent';
import useTimerFunc from '../hooks/useTimerFunc';

const HomeFeed = () => {
  const initialFeedData: UserFeedData[] = [
    {
      feedId: 62,
      nickname: '테스트',
      image: 'image',
      content: '작성 내용',
      type: '시작했습니다.',
      date: new Date(),
      isLike: true,
    },
    {
      feedId: 65,
      nickname: '어쩌고',
      content: '리액트',
      type: '시작했습니다.',
      image: 'image',
      date: new Date('2024-02-19T12:34:56'),
      isLike: true,
    },
    {
      feedId: 67,
      nickname: '맞는데요',
      image: 'image2',
      content: '게임',
      type: '마쳤습니다.',
      date: new Date('2024-02-14T12:34:56'),
      isLike: false,
    },
  ];
  const [feedData, setFeedData] = useState<UserFeedData[]>(initialFeedData);
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
      const userId = '임시';
      const updatedFeedData = [...feedData];
      updatedFeedData[index].isLike = !updatedFeedData[index].isLike;
      setFeedData(updatedFeedData);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/like/addlike`, {
        feedId: feedData[index].feedId,
        userId,
        isLike: updatedFeedData[index].isLike,
      });
      console.log('피드 좋아요 전송');
    } catch (error) {
      console.error('피드 좋아요', error);
    }
  };

  return (
    <>
      <section>
        <div className="flex justify-center h-12 w-full mt-10">
          <input
            placeholder="오늘 할 공부는?"
            className="w-1/3 outline-none rounded-md border-l-black indent-3 focus:outline-none placeholder:text-zinc-500"
          />
          <button
            onClick={startStudy}
            type="button"
            className="w-20 rounded-full bg-[#BBE2EC] drop-shadow-md active:filter-none">
            시작
          </button>
          {/* <button onClick={pauseStudy}>(임시)일시정지</button>
          <button onClick={() => endStudy(true)}>(임시)끝</button> */}
        </div>
        <UpdateFeed handleUpdateFeed={handleUpdateFeed} />
        <FeedContent initialFeedData={initialFeedData} feedData={feedData} handleLike={handleLike} />
      </section>
    </>
  );
};

export default HomeFeed;
