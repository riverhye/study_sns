'use client';

import Link from 'next/link';
import Category from './Category';
import HeaderIcons from '@/public/images/HeaderIcons';
import Timer from './Timer';
import TodoHeader from './TodoHeader';
import { useState } from 'react';

const HeaderLeft = () => {
  // 호버 시 setting 아이콘 색 변화
  const [hovered, setHovered] = useState(false);
  const nickname = localStorage.getItem('nickname');

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <>
      <div className="flex flex-col h-auto w-1/4  px-4 bg-main-blue p-0">
        <Category />
        <TodoHeader />
        <Timer />
        <div
          className="self-end pt-2 cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <Link href={'/user/editprofile'}>
            <HeaderIcons.Setting color={hovered ? 'gray' : 'none'} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeaderLeft;
