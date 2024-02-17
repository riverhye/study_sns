'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HeaderTop = () => {
  const [followerList, setFollowerList] = useState([
    { nickname: '테스트1', image: '이미지경로' },
    { nickname: '테스트2', image: '이미지경로' },
    { nickname: '테스트3', image: '이미지경로' },
    // { nickname: '테스트4', image: '이미지경로' },
    // { nickname: '테스트5', image: '이미지경로' },
    // { nickname: '테스트6', image: '이미지경로' },
    // { nickname: '테스트7', image: '이미지경로' },
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
    <div className="bg-gray-400 h-32 p-4">
      <div className="flex items-center">
        {followerList.map((follower, index) => (
          <div key={index} className="flex flex-col items-center mx-5 relative">
            {index < 3 && (
              <div className="absolute left-1 top-0 md:left-0 text-xl text-amber-400 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                {index + 1}
              </div>
            )}
            <Link href={`/`}>
              <div className="border-2 rounded-full w-20 h-20 md:w-12 md:h-12">
                <img src="" alt={follower.image} />
              </div>
            </Link>
            <div className="mt-1 text-sm md:text-xs">{follower.nickname}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderTop;
