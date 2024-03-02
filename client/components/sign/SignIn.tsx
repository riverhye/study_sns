'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useWebSocket } from '../providers/SocketContext';
import { setReduxToken } from '@/store/module/sign';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hooks';

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
  const token = useAppSelector(state => state.sign.token);

  useEffect(() => {
    if (data?.user) {
      const { name, email } = data.user;
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
          const token = response?.data?.token;
          const nickname = response?.data?.nickname;
          const profileImage = response?.data?.profileImage;

          if (userId) {
            localStorage.setItem('userId', userId);
          }
          if (token) {
            localStorage.setItem('accessToken', token);
          }
          if (nickname) {
            localStorage.setItem('nickname', nickname);
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
      console.log(1111111);
      disconnectWebSocket();
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('nickname');
      await signOut();
    } else {
      console.log('2222222');
      if (data && typeof data === 'object' && 'user' in data) {
        const { name, email } = (data as { user: { name: string; email: string } }).user;
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
            const token = response?.data?.token;
            const nickname = response?.data?.nickname;

            if (userId) {
              localStorage.setItem('userId', userId);
            }
            if (token) {
              localStorage.setItem('accessToken', token);
              const tokenSet = localStorage.getItem('accessToken');
              const nicknameSet = localStorage.getItem('nickname');

              dispatch(setReduxToken(tokenSet));
              dispatch(setReduxToken({ token: tokenSet, nickname: nicknameSet }));
            }
            if (nickname) {
              localStorage.setItem('nickname', nickname);
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
        localStorage.setItem('accessToken', res.data.token);
        localStorage.setItem('nickname', res.data.nickname);
        const token = localStorage.getItem('accessToken');
        const nickname = localStorage.getItem('nickname');
        dispatch(setReduxToken({ token: token, nickname: nickname }));
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('profileImage', res.data.profileImage);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
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
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 border border-gray-300">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">로그인</h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400"
                    type="text"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 bg-main-blue hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white">
                  로그인
                </button>
              </form>
              <div>
                <button
                  onClick={() => handleSign('GOOGLE')}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-gray-900">
                  구글 로그인
                </button>
              </div>
              <div className="flex justify-end mt-4">
                <Link href="/user/signup">
                  <button className="hover:text-main-blue focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-gray-800">
                    회원가입
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
