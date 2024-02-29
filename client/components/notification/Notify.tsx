'use client';

import { UserFeedData } from '@/type/type';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FeedContent from '../feed/FeedContent';
import { useWebSocket } from '../providers/SocketContext';
import { useAppSelector } from '@/store/hooks';

const Notify = () => {
  const token = useAppSelector(state => state.sign.token);
  const initialFeedData: UserFeedData[] = [
    {
      feedId: 92,
      nickname: '테스트',
      profileImage: 'https://source.boringavatars.com/beam/120/user_48a619',
      message: 'ㅁㅁ님이 나를 팔로우합니다.',
      date: String(new Date()),
    },
    {
      feedId: 169,
      nickname: '티니',
      profileImage: 'https://source.boringavatars.com/beam/120/user_4aa619',
      message: '나나님이 나의 피드에 좋아요를 눌렀습니다.',
      date: '2024-02-24',
    },
    {
      feedId: 203,
      nickname: '미역국',
      profileImage: 'https://source.boringavatars.com/beam/120/user_4ae819',
      message: '호지차님이 나를 팔로우합니다.',
      date: '2024-02-02',
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
      <FeedContent feedData={feedList} type="noti" />
    </>
  );
};

export default Notify;
