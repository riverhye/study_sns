'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HeaderTop = () => {
  const [followerList, setFollowerList] = useState([
    { nickname: '테스트1', image: '이미지' },
    { nickname: '테스트2', image: '이미지' },
    { nickname: '테스트3', image: '이미지' },
    { nickname: '테스트4', image: '이미지' },
    { nickname: '테스트5', image: '이미지' },
    { nickname: '테스트6', image: '이미지' },
    // { nickname: '테스트7', image: '이미지' },
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

  return (
    <div className="w-full h-32 p-4 flex items-center">
      {followerList.map((follower, index) => (
        <div key={index} className="flex flex-col items-center mx-4 relative">
          {index < 3 && (
            <div className="absolute left-0 top-0 md:left-0 text-xl text-amber-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              {index + 1}
            </div>
          )}
          <div className="has-tooltip">
            <Link href={`/`}>
              <div className="border-x-strong-yellow border-y-subtle-yellow	border-2 rounded-full w-20 h-20">
                <img src="" alt={follower.image} />
              </div>
            </Link>
            <div className="tooltip text-sm rounded shadow-lg p-1 w-24 bg-white text-main-blue mt-3 text-center">
              {follower.nickname}
              <span className="block text-center">00:00</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeaderTop;
