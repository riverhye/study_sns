'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setReduxToken } from '@/store/module/sign';

const EditProfile = () => {
  const router = useRouter();
  const placeHolderNickname: string = localStorage.getItem('nickname') ?? '';
  const [profileImage, setProfileImage] = useState<string>(localStorage.getItem('profileImage') ?? '');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [user_id, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [validPassword, setValidPassword] = useState<boolean>(true);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean>(true);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(true);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const dispatch = useDispatch();

  // 이미지
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files ? e.target.files[0] : null;
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/user/editprofile/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        localStorage.setItem('profileImage', response.data.imageUrl); // 이미지 URL을 localStorage에 저장
        setProfileImage(response.data.imageUrl);
        console.log('Profile image uploaded successfully');
      } catch (error) {
        console.error('Error uploading profile image:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  // 닉네임 형식/중복
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    const nicknameRegex = /^[a-zA-Z0-9가-힣_]{2,15}$/;
    const isNicknameValid = nicknameRegex.test(newNickname);
    if (newNickname === 'existingNickname') {
      setNicknameAvailable(false);
    } else {
      setNicknameAvailable(true);
    }
    setIsNicknameValid(isNicknameValid);
    setNickname(newNickname);
  };

  // 닉네임 수정
  const handleUpdateNickname = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!nicknameAvailable) {
        console.error('비밀번호 형식이 올바르지 않거나 닉네임이 이미 사용 중이거나 비밀번호가 일치하지 않습니다.');
        return;
      }

      // 로컬 스토리지에서 토큰을 가져옵니다.
      const token = localStorage.getItem('accessToken');

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/user/editprofile/nickname`,
        {
          nickname: nickname,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 헤더에 토큰을 포함시킵니다.
          },
        },
      );
      dispatch(setReduxToken({ token: token, nickname: nickname }));
      alert('닉네임 수정이 완료되었습니다.');
      router.push('/home');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.log('닉네임 수정 실패');
    }
  };

  // 비밀번호 형식 확인
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPasswordValue = e.target.value;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,14}$/;
    const isValidPassword = passwordRegex.test(newPasswordValue);
    setValidPassword(isValidPassword);
    setNewPassword(newPasswordValue);
  };

  // 기존 비밀번호 확인
  const handleCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentPasswordValue = e.target.value;
    setCurrentPassword(currentPasswordValue);
  };

  // 새 비밀번호 확인
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPasswordValue = e.target.value;
    setConfirmNewPassword(confirmPasswordValue);
    if (confirmPasswordValue === newPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  // 비번 수정
  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!validPassword || !passwordMatch) {
        console.error('비밀번호 형식이 올바르지 않거나 비밀번호가 일치하지 않습니다.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        console.error('새 비밀번호가 일치하지 않습니다.');
        setPasswordMatch(false);
        return;
      }

      const res = await axios.patch(`${process.env.NEXT_PUBLIC_URL}/user/editprofile/password`, {
        password: newPassword,
      });

      alert('비밀번호 수정이 완료되었습니다.');
      router.push('/home');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.log('비밀번호 수정 실패');
    }
  };

  // 탈퇴하기
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmDelete) {
      try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL}/user/delete`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        console.log('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('nickname');
        router.push('/');
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
      }
    }
  };

  return (
    <>
      <section>
        <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                정보수정
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleUpdateNickname}>
                <div>
                  <img src={profileImage} alt="Profile" className="rounded-full w-24 h-24" />
                  {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">닉네임</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    placeholder={placeHolderNickname}
                    value={nickname}
                    onChange={handleNicknameChange}
                  />
                  {!nickname && <span className="text-blue-600">닉네임을 입력해주세요.</span>}
                  {nickname && !isNicknameValid && (
                    <span className="text-red-600">2~15자의 한글, 영문, 숫자만 사용할 수 있습니다.</span>
                  )}
                  {nickname && !nicknameAvailable && <span className="text-red-600">이미 사용 중인 닉네임입니다.</span>}
                  {nickname && isNicknameValid && nicknameAvailable && (
                    <span className="text-blue-600">사용 가능한 닉네임입니다.</span>
                  )}
                </div>
                <div className="w-full flex justify-end">
                <button 
                  type="submit" 
                  className="ml-4 bg-primary-600 bg-main-blue hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white">

                  닉네임 수정
                </button>

</div>
              </form>

              <form className="space-y-4 md:space-y-6" onSubmit={handleUpdatePassword}>
                {/* <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">기존 비밀번호</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="Password"
                    value={currentPassword}
                    onChange={handleCurrentPassword}
                  />
                  {!currentPassword && (<span className="text-blue-600">기존 비밀번호를 입력해주세요.</span>)}
                  {currentPassword && !password && (<span className="text-red-600">비밀번호가 일치하지 않습니다.</span>)}
                  {currentPassword && currentPassword === password && (<span className="text-blue-600">비밀번호 일치</span>)}
                </div> */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">새 비밀번호</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handlePassword}
                  />
                  {!newPassword && <span className="text-blue-600">새 비밀번호를 입력해주세요.</span>}
                  {newPassword && !validPassword && (
                    <span className="text-red-600">
                      비밀번호 형식이 올바르지 않습니다. (소문자, 대문자, 숫자로 조합된 6~14자리)
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    새 비밀번호 확인
                  </label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {!confirmNewPassword && <span className="text-blue-600">새 비밀번호를 다시 한 번 입력해주세요.</span>}
                  {confirmNewPassword && !passwordMatch && (
                    <span className="text-red-600">새 비밀번호가 일치하지 않습니다.</span>
                  )}
                  {confirmNewPassword && confirmNewPassword === newPassword && (
                    <span className="text-blue-600">새 비밀번호 일치</span>
                  )}
                </div>
                <div className="w-full flex justify-end">
                <button 
                  type="submit" 
                  className="ml-4 bg-primary-600 bg-main-blue hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white">
                  비밀번호 수정
                </button>
</div>
              </form>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="ml-4 bg-primary-600 bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white">
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfile;
