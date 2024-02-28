'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../providers/SocketContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import Image from 'next/image';
import { IMessageEvent } from 'websocket';
import { FollowerRank } from '@/type/type';

const HeaderTop: React.FC = () => {
  const [followerList, setFollowerList] = useState<FollowerRank[]>([
    { nickname: '테스트2', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트1', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트3', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트4', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트5', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트6', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트7', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트8', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트9', profileImage: null, todayStudyTime: 300 },
    { nickname: '테스트10', profileImage: null, todayStudyTime: 300 },
  ]);
  const { socket } = useWebSocket();

  // 미리 작성: follower 목록 소켓 send
  useEffect(() => {
    if (socket) {
      try {
        const rank = { action: 'rank' };

        const handleSocketMessage = (evt: IMessageEvent) => {
          if (evt.data) {
            console.log('follower rank socket');
            // setFollowerList();
          } else {
          }
        };

        // 1분에 한 번씩 setInterval 요청
        const intervalId = setInterval(() => {
          socket.send(JSON.stringify(rank));
          console.log('send data');
        }, 3000);

        // 메시지 이벤트에 대한 콜백 등록
        socket.onmessage = handleSocketMessage;

        return () => {
          // 클리어할 때 이전에 등록한 콜백을 해제
          socket.onmessage = handleSocketMessage;
          clearInterval(intervalId);
        };
      } catch (error) {
        console.error('follow socket', error);
      }
    }
  }, []);

  return (
    <div className="mt-5">
      <Swiper
        modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={10}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}>
        <div className="w-full h-32 p-4 flex items-center">
          {followerList.map((follower, idx) => (
            <React.Fragment key={follower.nickname}>
              <SwiperSlide key={follower.nickname}>
                <div className="flex flex-col items-center mx-4">
                  <div className="has-tooltip relative">
                    <Link href={`/study/${follower.nickname}`}>
                      <div className="border-x-strong-yellow border-y-subtle-yellow border-4 rounded-full w-20 h-20 overflow-hidden">
                        <Image src="/blank-profile.png" priority={false} alt="user profile" width={300} height={300} />
                      </div>
                    </Link>
                    <div className=" absolute top-4 tooltip text-sm rounded shadow-lg p-1 w-24 bg-white text-main-blue mt-3 text-center cursor-default">
                      {follower.nickname}
                      <span className="block text-center cursor-default">00:00</span>
                    </div>
                  </div>
                  {idx < 3 && (
                    <div className="absolute left-20 top-0 text-2xl text-amber-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                      {idx + 1}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            </React.Fragment>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default HeaderTop;
