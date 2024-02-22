'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';

SwiperCore.use([Navigation]);

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

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}`);
        setFollowerList(res.data);
      } catch (error) {
        console.error('팔로워 header', error);
      }
    };

    // getData();
  }, [followerList]);

  const swiperRef = useRef<SwiperCore | null>(null);

  return (
    <Swiper
      slidesPerView={5} // 한 번에 보여질 아이템의 수
      slidesPerGroup={5} // 한 번에 슬라이드할 그룹의 수
      navigation>
      <div className="w-full h-32 p-4 flex items-center">
        {followerList.map((follower, index) => (
          <SwiperSlide>
            <div key={index} className="flex flex-col items-center mx-4 relative">
              {index < 3 && (
                <div className="absolute left-0 top-0 md:left-0 text-xl text-amber-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {index + 1}
                </div>
              )}
              <div className="has-tooltip">
                <Link href={`/`}>
                  <div className="border-x-strong-yellow border-y-subtle-yellow	border-2 rounded-full w-20 h-20 overflow-hidden">
                    <Image src="/blank-profile.png" alt="user profile" width={300} height={300} />
                  </div>
                </Link>
                <div className="tooltip text-sm rounded shadow-lg p-1 w-24 bg-white text-main-blue mt-3 text-center">
                  {follower.nickname}
                  <span className="block text-center">00:00</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </div>
    </Swiper>
  );
};

export default HeaderTop;
