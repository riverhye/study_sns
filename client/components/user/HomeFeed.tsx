'use client';

import FeedContent from './FeedContent';
// import { UserFeedData } from '@/type/type';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UpdateFeed from './UpdateFeed';

export interface UserFeedData {
  nickname: string;
  image: string;
  content: string;
  type: string;
}

const HomeFeed = () => {
  const initialFeedData: UserFeedData[] = [
    { nickname: '테스트', image: 'image', content: '작성 내용', type: '시작했습니다.' },
    {
      nickname: '어쩌고',
      content: '리액트',
      type: '시작했습니다.',
      image: 'image',
    },
    { nickname: '맞는데요', image: 'image2', content: '게임', type: '마쳤습니다.' },
  ];
  const [feedData, setFeedData] = useState<UserFeedData[]>(initialFeedData);

  // 접속 시 팔로워들의 공부 시작/끝, 나를 새 팔로우, 나를 좋아요 한 가져오기
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get<UserFeedData[]>(`${process.env.NEXT_PUBLIC_URL}/feed`);
        setFeedData(res.data);
      } catch (err) {
        console.error('메인 데이터 로드 실패', err);
      }
    };
    getData();
  }, []);

  return (
    <>
      <section>
        <div className="flex justify-center h-12 w-full">
          <input className="w-1/2 outline-none rounded-md shadow-sm block indent-3 focus:outline-none focus:ring-sky-500 focus:ring-1 focus:border-sky-500  placeholder:text-slate-400" />
          <button className="w-32 border-2 rounded-full">시작</button>
        </div>
        <UpdateFeed />
        <FeedContent feedData={feedData} />
      </section>
    </>
  );
};

export default HomeFeed;
