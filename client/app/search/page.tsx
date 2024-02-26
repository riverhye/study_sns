'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
interface userdataI {
  nickname: string;
  profileImage: string;
  isFollowing: boolean;
}
const Search = () => {
  const [searchNickname, setsearchNickname] = useState<string>('');
  const [user, setUser] = useState<userdataI[]>([
    { nickname: 'test', profileImage: '', isFollowing: false },
    { nickname: 'test', profileImage: '', isFollowing: false },
  ]);
  const searchUser = async () => {
    const res = (await axios.get(`${process.env.NEXT_PUBLIC_URL}/searchUser/${searchNickname}`)).data;
    setUser(res);
  };
  // useEffect(() => {
  //   if (searchNickname) {
  //     searchUser();
  //   }
  // }, [searchNickname]);
  return (
    <>
      <div>
        <input
          type="text"
          className=" mb-10 border-b-2 border-b-stone-800 outline-none"
          onChange={e => setsearchNickname(e.target.value)}
          value={searchNickname}></input>
        <button onClick={searchUser} className=" bg-black text-gray-50 mx-2 w-[70px] h-[30px] rounded-md">
          검색
        </button>
      </div>

      <div className="flex flex-wrap w-[90%] ">
        {user.map((userlist, index) => (
          <Link
            href={`study/${userlist.nickname}`}
            key={index}
            className="flex items-center w-[300px] h-[100px] justify-between shadow-md rounded-lg border-gray-300 border-[1.2px] mr-5">
            <div className="flex items-center">
              <div className="w-[60px] bg-amber-200 rounded-full h-[60px] mr-2 ml-4 ">{userlist.profileImage}</div>
              <div>{userlist.nickname}</div>
            </div>

            <button className="border-[1px] border-stone-800 rounded-md mx-4 w-[70px] h-[30px]">팔로우</button>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Search;
