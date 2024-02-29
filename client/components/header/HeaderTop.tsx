'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../providers/SocketContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { FollowerRank } from '@/type/type';
import { useAppSelector } from '@/store/hooks';
import { format } from 'date-fns';

const HeaderTop: React.FC = () => {
  const [followerList, setFollowerList] = useState<FollowerRank[]>([]);
  const nickname = useAppSelector(state => state.sign.nickname);

  // follower 목록
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/follow/rank`);
        const followers: FollowerRank[] = res.data;
        const filteredFollowers = followers.filter(follower => follower.nickname !== nickname);
        const followerArr = filteredFollowers.map(follower => ({
          nickname: follower.nickname,
          profileImage: follower.profileImage,
          todayStudyTime: follower.todayStudyTime,
        }));
        setFollowerList(prevFollowerList => [...followerArr, ...prevFollowerList]);
      } catch (error) {
        console.error('Error fetching follower data:', error);
      }
    };

    getData();
  }, []);

  //   if (socket) {
  //     try {
  //       // nickname이 나랑 동일한 거 제외한 배열 반환 filter
  //       //
  //       // const intervalId = setInterval(() => {
  //       const rank = { action: 'rank' };
  //       socket.send(JSON.stringify(rank));
  //       console.log('send data');
  //       // }, 3000);

  //       socket.onmessage = evt => {
  //         try {
  //           console.log(evt.data);
  //           const data = evt.data as string;
  //           const parsedData = JSON.parse(data);
  //           console.log(parsedData);

  //           if (Array.isArray(parsedData)) {
  //             const transformedData: FollowerRank[] = parsedData.map((data: any) => ({
  //               nickname: data.nickname || '',
  //               profileImage: data.profileImage || null,
  //               todayStudyTime: data.todayStudyTime || 0,
  //             }));
  //             transformedData.sort((a, b) => b.todayStudyTime - a.todayStudyTime);
  //             console.log('가공', transformedData);
  //             setFollowerList(transformedData);
  //           }
  //         } catch (error) {
  //           console.error('Error parsing JSON:', error);
  //         }
  //       };

  //       // return () => clearInterval(intervalId);
  //       // socket.onmessage = evt => {
  //       //   console.log(evt);
  //       // };
  //     } catch (error) {
  //       console.error('err', error);
  //     }
  //   }
  const token = useAppSelector(state => state.sign.token);

  const formatStudyTime = (minutes: number) => {
    const studyDate = new Date(0); // Initialize a date object with the epoch time
    studyDate.setMinutes(minutes); // Set the minutes to the date object

    return format(studyDate, 'HH:mm'); // Format the date object to 'hh:mm'
  };

  return (
    <div className="mt-5 w-[1400px]">
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
          {token && (
            <>
              {followerList.map((follower, idx) => (
                <React.Fragment key={follower.nickname + idx}>
                  <SwiperSlide key={follower.nickname + idx}>
                    <div className="flex flex-col items-center mx-4">
                      <div className="has-tooltip relative">
                        <Link href={`/study/${follower.nickname}`}>
                          <div className="border-x-strong-yellow border-y-subtle-yellow border-4 rounded-full w-20 h-20 overflow-hidden">
                            <img
                              src={`${process.env.NEXT_PUBLIC_USER_IMG_URL}/user_4ae8a619`}
                              alt="profile"
                              width={300}
                              height={300}
                            />
                          </div>
                        </Link>
                        <div className=" absolute top-4 tooltip text-sm rounded shadow-lg p-1 w-24 bg-white text-main-blue mt-3 text-center cursor-default">
                          {follower.nickname}
                          <span className="block text-center cursor-default">
                            {formatStudyTime(follower.todayStudyTime)}
                          </span>
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
            </>
          )}
        </div>
      </Swiper>
    </div>
  );
};

export default HeaderTop;
