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

      <section>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  로그인
              </h1>
              <form class="space-y-4 md:space-y-6" action="#">
                  <div>
                    <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="Email" />
                  </div>

                  <div>
                    <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="password" placeholder="Password"/>
                  </div>

                  <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Sign in
                  </button>
              </form>

              <div>
                <button onClick={() => handleLogin('google')}>
                  구글 계정 {data ? '로그아웃' : '로그인'}
                </button>
              </div>

              <div>
                <button onClick={() => handleLogin('kakao')}>
                  카카오 계정 {data ? '로그아웃' : '로그인'}
                </button>
              </div>

              <button>
                회원가입
              </button>
            </div>
          </div>
        </div>
      </section>


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
