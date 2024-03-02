'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
        console.log(res.data);
        const followers: FollowerRank[] = res.data;
        const filteredFollowers = followers.filter(follower => follower.nickname !== nickname);
        const followerArr = filteredFollowers.map(follower => ({
          nickname: follower.nickname,
          profileImage: follower.profileImage,
          todayStudyTime: follower.todayStudyTime,
        }));
        setFollowerList(followerArr);
      } catch (error) {
        console.error('Error fetching follower data:', error);
      }
    };

    getData();
  }, []);

  const token = useAppSelector(state => state.sign.token);

  // 공부 시간 분 단위 -> hh:mm 단위로 가공
  const formatStudyTime = (minutes: number) => {
    const studyDate = new Date(0);
    studyDate.setMinutes(minutes);

    return format(studyDate, 'HH:mm');
  };

  return (
    <div className="mt-5 w-auto">
      <Swiper
        modules={[Navigation]}
        spaceBetween={50}
        slidesPerView={5}
        slidesPerGroup={5}
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
                            <img src={follower.profileImage || ''} alt="profile" width={300} height={300} />
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
