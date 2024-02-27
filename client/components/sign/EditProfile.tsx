'use client';

// 'use client' 생략

import { useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const placeHolderNickname: string = localStorage.getItem("nickname") ?? '';
  // const imageUserId: string = localStorage.getItem("user_id") ?? '';
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [user_id, setUserid] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [validPassword, setValidPassword] = useState<boolean>(true);
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean>(true);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<string>('');

  // 비밀번호 형식 확인
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPasswordValue = e.target.value;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,14}$/;
    const isValidPassword = passwordRegex.test(newPasswordValue);
    setValidPassword(isValidPassword);
    setNewPassword(newPasswordValue);
  };

  // 닉네임 변경/중복
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;
    const isNicknameValid = nicknameRegex.test(newNickname);
    if (newNickname === 'existingNickname') {
      setNicknameAvailable(false);
    } else {
      setNicknameAvailable(true);
    }
    setIsNicknameValid(isNicknameValid);
    setNickname(newNickname);
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

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files ? e.target.files[0] : null;
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/user/profile/image/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setProfileImage(response.data.imageUrl);
        console.log('Profile image uploaded successfully');
      } catch (error) {
        console.error('Error uploading profile image:', error);
      }
    } else {
      console.error('No file selected');
    }
  };
  
  // 수정하기 함수
  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!validPassword || !nicknameAvailable || !passwordMatch) {
        console.error('비밀번호 형식이 올바르지 않거나 닉네임이 이미 사용 중이거나 비밀번호가 일치하지 않습니다.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        console.error('새 비밀번호가 일치하지 않습니다.');
        setPasswordMatch(false);
        return;
      }

      const res = await axios.put(`${process.env.NEXT_PUBLIC_URL}/user/update`, {
        nickname: nickname,
        currentPassword: currentPassword,
        newPassword: newPassword
      });

      console.log('정보 수정이 완료되었습니다.');
    } catch (error) {
      console.error('Error updating profile:', error);
      console.log('정보 수정 실패');
    }
  };

  // 탈퇴하기
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmDelete) {
      try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL}/user/delete/{userId}`, {
          data: {
            userId: user_id
          }
        });
        console.log('회원 탈퇴가 완료되었습니다.');

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
              <form className="space-y-4 md:space-y-6" onSubmit={handleUpdateProfile}>
                <div>
                  {/* <img src={imageProfile} alt="Profile" className="rounded-full w-24 h-24" /> */}
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">닉네임</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    placeholder={placeHolderNickname}
                    value={nickname}
                    onChange={handleNicknameChange}
                  />
                  {!nickname && (<span className="text-blue-600">닉네임을 입력해주세요.</span>)}
                  {nickname && !isNicknameValid && (<span className="text-red-600">2~10자의 한글, 영문, 숫자만 사용할 수 있습니다.</span>)}
                  {nickname && !nicknameAvailable && (<span className="text-red-600">이미 사용 중인 닉네임입니다.</span>)}
                  {nickname && isNicknameValid && nicknameAvailable && (<span className="text-blue-600">사용 가능한 닉네임입니다.</span>)}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">기존 비밀번호</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  {!currentPassword && (<span className="text-blue-600">기존 비밀번호를 입력해주세요.</span>)}
                  {confirmNewPassword && !passwordMatch && (<span className="text-red-600">비밀번호가 일치하지 않습니다.</span>)}
                  {confirmNewPassword && confirmNewPassword === newPassword && (<span className="text-blue-600">비밀번호 일치</span>)}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">새 비밀번호</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                  />
                  {!newPassword && (<span className="text-blue-600">새 비밀번호를 입력해주세요.</span>)}
                  {newPassword && !validPassword && (<span className="text-red-600">비밀번호 형식이 올바르지 않습니다. (소문자, 대문자, 숫자로 조합된 6~14자리)</span>)}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">새 비밀번호 확인</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {!confirmNewPassword && (<span className="text-blue-600">새 비밀번호를 다시 한 번 입력해주세요.</span>)}
                  {confirmNewPassword && !passwordMatch && (<span className="text-red-600">새 비밀번호가 일치하지 않습니다.</span>)}
                  {confirmNewPassword && confirmNewPassword === newPassword && (<span className="text-blue-600">새 비밀번호 일치</span>)}
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  수정하기
                </button>

                <button type="button" onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  탈퇴하기
                </button>

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfile;
