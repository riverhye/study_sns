'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data } = useSession();
  console.log(data);

  const handleLogin = async (type: string) => {
    if (data) await signOut();
    else await signIn(type, { redirect: true, callbackUrl: '/' });
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button className="btn" onClick={() => handleLogin('google')}>
        구글 계정 {data ? '로그아웃' : '로그인'}
      </button>
      <button onClick={() => handleLogin('kakao')}>카카오 계정 {data ? '로그아웃' : '로그인'}</button>

      {data?.user ? (
        <>
          <h5>로그인 정보</h5>
          <div>{data.user.name}</div>
          <img src={data.user.image!} alt="user img" />
          <div>{data.user.email}</div>
        </>
      ) : (
        ''
      )}
    </>
  );
}
