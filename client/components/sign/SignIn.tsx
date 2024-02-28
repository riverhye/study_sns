'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useWebSocket } from '../providers/SocketContext';
import { setReduxToken } from '@/store/module/sign';
import { useDispatch } from 'react-redux';
export default function SignIn() {
  const { data } = useSession();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loginType, setLoginType] = useState('');
  const router = useRouter();
  const { connectWebSocket, disconnectWebSocket } = useWebSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.user) {
      const { name, email } = data.user;
      // 서버에 로그인 요청
      axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/user/social/login`,
          JSON.stringify({
            email,
            nickname: name,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          console.log(response);
          const userId = response?.data?.userId;
          const token = response?.data?.token; // 응답에서 토큰 추출
          const nickname = response?.data?.nickname; // 응답에서 닉네임 추출
          const profileImage = response?.data?.profileImage;

          if (userId) {
            localStorage.setItem('userId', userId); // 토큰을 로컬 스토리지에 저장
          }
          if (token) {
            localStorage.setItem('accessToken', token); // 토큰을 로컬 스토리지에 저장
          }
          if (nickname) {
            localStorage.setItem('nickname', nickname); // 닉네임을 로컬 스토리지에 저장
          }
          if (profileImage) {
            localStorage.setItem('profileImage', profileImage);
          }
        })
        .catch(error => {
          console.error('Request failed:', error);
        });
    }
  }, [data, loginType]);

  const handleSign = async (type: string) => {
    setLoginType(type);
    console.log('sgin');
    if (data) {
      // 소셜 로그아웃 : 소켓 끊기
      console.log(1111111);
      disconnectWebSocket();
      localStorage.removeItem('userId'); // 토큰을 로컬 스토리지에 저장
      localStorage.removeItem('accessToken'); // 토큰을 로컬 스토리지에 저장
      localStorage.removeItem('nickname'); // 닉네임을 로컬 스토리지에 저장
      await signOut();
    } else {
      console.log('2222222');
      // 소셜 로그인 : 소켓 연결
      if (data && typeof data === 'object' && 'user' in data) {
        const { name, email } = (data as { user: { name: string; email: string } }).user;
        // 서버에 로그인 요청
        axios
          .post(
            `${process.env.NEXT_PUBLIC_URL}/user/social/login`,
            JSON.stringify({
              email,
              nickname: name,
            }),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(response => {
            console.log(response);
            const userId = response?.data?.userId;
            const token = response?.data?.token; // 토큰을 로컬 스토리지에 저장
            const nickname = response?.data?.nickname; // 응답에서 닉네임 추출

            if (userId) {
              localStorage.setItem('userId', userId); // 토큰을 로컬 스토리지에 저장
            }
            if (token) {
              localStorage.setItem('accessToken', token); // 토큰을 로컬 스토리지에 저장
              const tokenSet = localStorage.getItem('accessToken');
              const nicknameSet = localStorage.getItem('nickname');

              dispatch(setReduxToken(tokenSet));
              dispatch(setReduxToken({ token: tokenSet, nickname: nicknameSet }));
            }
            if (nickname) {
              localStorage.setItem('nickname', nickname); // 닉네임을 로컬 스토리지에 저장
            }
          })
          .catch(error => {
            console.error('Request failed:', error);
          });
      }
      connectWebSocket();
      await signIn(type, { redirect: false, callbackUrl: '/' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/user/signin/process`, {
        userId: userId,
        email: email,
        password: password,
      });
      if (res.data.token) {
        alert('로그인 성공');
        localStorage.setItem('accessToken', res.data.token);
        localStorage.setItem('nickname', res.data.nickname);
        const token = localStorage.getItem('accessToken');
        const nickname = localStorage.getItem('nickname');
        dispatch(setReduxToken({ token: token, nickname: nickname }));
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('profileImage', res.data.profileImage);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        // 소켓 연결
        connectWebSocket();
        router.push('/home');
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('로그인 실패!!');
    }
  };
  return (
    <>
      <section>
        <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                로그인
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  로그인
                </button>
              </form>
              <div>
                <button onClick={() => handleSign('GOOGLE')}>구글</button>
              </div>
              {/* <div> */}
              {/* <button onClick={() => handleSign('KAKAO')}>카카오 계정 {data ? '로그아웃' : '로그인'}</button> */}
              {/* </div> */}
              <Link href={'/user/signup'}>
                <button>회원가입</button>
              </Link>
            </div>
          </div>

          {/* {data?.user && ( */}
          {/* <> */}
          {/* <h5>소셜 로그인 정보</h5> */}
          {/* <div>{data.user.name}</div> */}
          {/* <div>{data.user.email}</div> */}
          {/* <img src={data.user.image!} alt="user img" /> */}
          {/* 로그인 타입 지정...구글이면 구글 카카오면 카카오 , 랜덤닉네임*/}
          {/* </> */}
          {/* )} */}
        </div>
      </section>
    </>
  );
}
