'use client';

import axios from 'axios';
import { UserFeedData, TimerState } from '@/type/type';
import { useEffect, useState } from 'react';
import UpdateFeed from './UpdateFeed';
import FeedContent from './FeedContent';
import useTimerFunc from '../hooks/useTimerFunc';

interface stateValue {
  content: string;
  error: string;
}

const HomeFeed = () => {
  const [value, setValue] = useState<stateValue>({ content: '', error: '' });
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

  // 빈값 아닐 때에만 타이머 시작 (1) 엔터키
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 키의 기본 동작인 줄바꿈을 막음
      value.content.trim() !== ''
        ? startStudy(value.content)
        : setValue({ ...value, error: '공부할 내용을 먼저 입력해 주세요.' });
    }
  };

  // 빈값 아닐 때에만 타이머 시작 (2) 클릭
  const handleContent = () => {
    if (value.content.trim() !== '') startStudy(value.content);
    else setValue({ ...value, error: '공부할 내용을 먼저 입력해 주세요.' });
  };

  return (
    <>
      <section>
        <div className="flex justify-center h-12 w-full mt-10">
          <input
            onChange={e => setValue({ ...value, content: e.target.value })}
            onKeyDown={handleEnter}
            placeholder="무엇을 공부할까요?"
            className="w-1/4 outline-none border-b-2 border-b-main-blue indent-3 focus:outline-none placeholder:text-zinc-500"
          />
          <button
            onClick={handleContent}
            type="button"
            className="w-20 ml-3 rounded-md bg-strong-yellow active:filter-none shadow-md transform active:scale-75 transition-transform">
            START
          </button>
          {/* <button onClick={pauseStudy}>(임시)일시정지</button>
          <button onClick={() => endStudy(true)}>(임시)끝</button> */}
        </div>

        <div role="alert" className="text-red-400 text-xs mt-4 flex justify-center h-10">
          {value.error}
        </div>

        <UpdateFeed handleUpdateFeed={handleUpdateFeed} />
        <FeedContent initialFeedData={initialFeedData} feedData={feedData} handleLike={handleLike} />
      </section>
    </>
  );
};

export default HomeFeed;
