'use client';

import { UserFeedData } from '@/type/type';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FeedContent from '../feed/FeedContent';

export const token = localStorage.getItem('accessToken');

const Notify = () => {
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
  const [feedList, setFeedList] = useState<UserFeedData[]>(initialFeedData);

  // const getNoti = async () => {
  //   const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/noti`, {
  //     params: { token: token },
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   setFeedList(res.data.feedList);
  // };

  // useEffect(() => {
  //   // getNoti();
  // }, []);

  return (
    <>
      <FeedContent initialFeedData={initialFeedData} feedData={feedList} type="noti" />
    </>
  );
};

export default Notify;
