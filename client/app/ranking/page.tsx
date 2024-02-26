'use client';
import RankUI from '@/components/ranking/RankUI';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
export const metadata = {
  title: '랭킹',
};
interface RankingData {
  profileImage: string;
  nickname: string;
  studyDate: string;
  todoayStudyTime: number;
}
const Ranking = () => {
  const [rankingList, getRankingList] = useState<RankingData[]>([
    { profileImage: '', nickname: 'test', studyDate: '', todoayStudyTime: 150 },
    { profileImage: '', nickname: '', studyDate: '', todoayStudyTime: 150 },
  ]);
  async function getRnaking() {
    const res: RankingData[] = await axios.get(`${process.env.NEXT_PUBLIC_URL}/ranking`);

    getRankingList(res);
  }
  return (
    <div>
      {rankingList.map((list, index) => (
        <Link href={`study/${list.nickname}`}>
          <div key={index} className=" mt-5">
            <RankUI uidata={list} index={index} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Ranking;
