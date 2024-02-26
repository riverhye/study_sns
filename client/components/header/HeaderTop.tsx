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

const HeaderTop: React.FC = () => {
  const [followerList, setFollowerList] = useState([
    { nickname: '테스트1', image: '이미지' },
    { nickname: '테스트2', image: '이미지' },
    { nickname: '테스트3', image: '이미지' },
    { nickname: '테스트4', image: '이미지' },
    { nickname: '테스트5', image: '이미지' },
    { nickname: '테스트6', image: '이미지' },
    { nickname: '테스트7', image: '이미지' },
    { nickname: '테스트8', image: '이미지' },
    { nickname: '테스트9', image: '이미지' },
    { nickname: '테스트10', image: '이미지' },
  ]);
  const { socket } = useWebSocket();

  useEffect(() => {
    // follower 목록 소켓 send
    if (socket) {
      try {
        const follow = { action: 'follow' };
        socket.send(JSON.stringify(follow));
        console.log('send data');
      } catch (error) {
        console.error('follow socket', error);
      }
    }

    //   //   const getData = async () => {
    //   //     try {
    //   //       const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}`);
    //   //       setFollowerList(res.data);
    //   //     } catch (error) {
    //   //       console.error('팔로워 header', error);
    //   //     }
    //   //   };

    //   // getData();
  }, [followerList]);

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
                    {/* <Link href={`/`}> */}
                    <div className="border-x-strong-yellow border-y-subtle-yellow border-4 rounded-full w-20 h-20 overflow-hidden">
                      <Image src="/blank-profile.png" priority={false} alt="user profile" width={300} height={300} />
                    </div>
                    {/* </Link> */}
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
