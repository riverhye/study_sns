'use client';
import RankUI from '@/components/ranking/RankUI';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface RankingData {
  profileImage: string;
  nickname: string;
  studyDate: string;
  todayStudyTime: number;
}
const RankComponent = () => {
  const [rankingList, getRankingList] = useState<RankingData[]>([]);
  async function getRnaking() {
    const res: RankingData[] = (await axios.get(`${process.env.NEXT_PUBLIC_URL}/ranking`)).data;

    getRankingList(res);
    console.log(res);
  }

  useEffect(() => {
    getRnaking();
  }, []);
  return (
    <div className="flex  w-full justify-center flex-col align-middle">
      {rankingList.map((list, index) => (
        <Link href={`study/${list.nickname}`}>
          <div key={index} className=" mt-5 ">
            <RankUI uidata={list} index={index} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RankComponent;
