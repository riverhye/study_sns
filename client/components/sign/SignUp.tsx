'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const router = useRouter();



  const handleEmailCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newEmail = e.target.value;
    setEmail(newEmail);

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 이메일 중복 검사
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/user/signupcheck`, {
        email: newEmail
      });
      if (!res.data.emailAvailable) {
        setEmailError('이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailError('이메일을 확인하는 중 오류가 발생했습니다.');
    }
  };


  


  //비밀번호 유효성 검사
  const validatePassword = (password: string, confirmPassword: string) => {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,14}$/.test(password)) {
        setValidPassword(false);
    } else {
        setValidPassword(true);
    }
  };


  //비밀번호 유효성/일치 확인 
  const handlePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword, confirmPassword);
  }

  const handleConfirmPasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);
    validatePassword(password, confirmPasswordValue);
    if (confirmPasswordValue === password) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/user/signup/process`, {
        email: email,
        password: password,
      });

      alert('회원가입 성공');
      router.push('/home');
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
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailCheck}
                />
                {emailError && <span className="text-red-600">{emailError}</span>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호</label>
                <input
                  className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!validPassword ? 'border-red-500' : ''}`}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordCheck}
                />
                {!validPassword && <span className="text-red-600">비밀번호 형식이 올바르지 않습니다. (소문자, 대문자, 숫자로 조합된 6~14자리)</span>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호 확인</label>
                <input
                  className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!passwordMatch ? 'border-red-500' : ''}`}
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordCheck}
                />
                {!passwordMatch && <span className="text-red-600">비밀번호가 일치하지 않습니다.</span>}
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
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
