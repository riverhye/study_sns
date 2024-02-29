'use client';

import Link from 'next/link';
import Category from './Category';
import HeaderIcons from '@/public/images/HeaderIcons';
import Timer from './Timer';
import TodoHeader from './TodoHeader';
import { useEffect, useState } from 'react';
import Logout from '../sign/Logout';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { resetReduxToken } from '@/store/module/sign';
import { resetReduxTrigger, setReduxTrigger } from '@/store/module/trigger';

const HeaderLeft = () => {
  const token = localStorage.getItem('accessToken');
  const dispatch = useDispatch();
  const getToken = useAppSelector(state => state.sign.token);

  const handleSignOut = () => {
    dispatch(resetReduxToken());
    dispatch(resetReduxTrigger());
  };

  useEffect(() => {
    // 토큰이 없을 때만 로그아웃 처리
    if (!token) {
      handleSignOut();
    }
  }, [token]);

  return (
    <>
      <div className="flex flex-col h-auto w-1/4 px-4 bg-main-blue p-0">
        <Category />
        {getToken && (
          <>
            <TodoHeader />
            <Timer />
            <div className="relative inline-block text-left mt-6">
              <div className="group">
                <button className="transition-all duration-200 focus:outline-none p-4">
                  <HeaderIcons.Setting color="gray" />
                </button>
                <div className="absolute left-14 -top-2 hidden w-30 bg-white border-2 border-strong-blue rounded-lg group-hover:block cursor-pointer">
                  <Link href={'/user/editprofile'}>
                    <span className="block p-[10px] hover:bg-subtle-blue bg-white rounded-lg">정보수정</span>
                  </Link>
                  <Link href={'/'}>
                    <span className="block p-[10px] hover:bg-subtle-blue bg-white rounded-lg" onClick={handleSignOut}>
                      <Logout />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="w-56 h-[600px]"></div>
      </div>
    </>
  );
};

export default HeaderLeft;
