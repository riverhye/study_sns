'use client';


import { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [EmailResult, setEmailResult] = useState('');
  const [pwResult, setPwResult] = useState('');


  const doubleCheck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/user/signupcheck`, {
        email: email
      });
  
      if (res.data.token === true) {
        alert('존재하는 이메일입니다.');
      } else {
        alert('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      console.error('Error signupcheck in:', error);
      alert('이메일 중복 체크 실패!!');
    }
  };
  const handlePwInput = () => {
    const pwInput = document.getElementById('pw') as HTMLInputElement;
    const pwCheck = document.getElementById('pwCheck');
  
    if (pwCheck) {
      if (pwInput && !pwInput.checkValidity()) {
        pwCheck.innerHTML =
          '비밀번호 형식이 올바르지 않습니다. (소문자, 대문자, 숫자로 조합된 6~14자리)';
        pwCheck.style.color = 'rgb(255, 89, 89)';
      } else {
        pwCheck.innerHTML = '';
      }
    }
  };
  

  const pwCheck = () => {
    const pw = document.getElementById('pw') as HTMLInputElement;
    const pwConfirm = document.getElementById('pwConfirm') as HTMLInputElement;
    const pwResult = document.getElementById('pwResult');
  
    if (pw && pwConfirm && pwResult) {
      if (pw.value !== '' && pwConfirm.value !== '') {
        if (pw.value === pwConfirm.value) {
          pwResult.innerHTML = '비밀번호 일치';
          pwResult.style.color = 'rgb(54, 54, 255)';
        } else {
          pwResult.innerHTML = '비밀번호가 일치하지 않습니다';
          pwResult.style.color = 'rgb(255, 89, 89)';
        }
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/user/signup/process`, {
        email: email,
        password: password,
        nickname: nickname
      });

      alert('회원가입 성공');
      document.location.href = '/home';
    } catch (error) {
      console.error('Error signing up:', error);
      alert('회원가입 실패!!');
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              회원가입
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">이메일</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                 <button type="submit">중복확인</button>

                 <div id="id_result"> </div>



              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">닉네임</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <button type="button">중복확인</button>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호 확인</label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="password"
                  placeholder="Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <input className="" type="checkbox" />
                <a href='#'> 약관동의</a>
              </div>

              <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                가입하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
