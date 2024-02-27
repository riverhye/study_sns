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
  const token = localStorage.getItem('accessToken');
  const [searchNickname, setsearchNickname] = useState<string>('');
  const [user, setUser] = useState<userdataI[]>([]);
  const searchUser = async () => {
    const res = (
      await axios.get(`${process.env.NEXT_PUBLIC_URL}/searchUser/${searchNickname}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;
    setUser(res);
  };
  // useEffect(() => {
  //   if (searchNickname) {
  //     searchUser();
  //   }
  // }, [searchNickname]);
  return (
    <>
      <div className="flex justify-center h-12 w-full mt-10">
        <input
          type="text"
          className=" w-1/4 h-[40px] outline-none indent-3 focus:outline-none placeholder:text-zinc-500 focus:bg-subtle-blue rounded-md transition-all"
          onChange={e => setsearchNickname(e.target.value)}
          value={searchNickname}></input>
        <button
          onClick={searchUser}
          className="w-20 h-[40px] ml-3 rounded-md bg-strong-yellow active:filter-none shadow-md transform active:scale-75 transition-transform">
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
