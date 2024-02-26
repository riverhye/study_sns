//랭킹ui props로 랭크 값 받기
'use client';
import React from 'react';
interface props {
  uidata: {
    profileImage: string;
    nickname: string;
    studyDate: string;
    todoayStudyTime: number;
  };
  index: number;
}
const RankUI = (props: props) => {
  const contents = props.uidata;

  return (
    <>
      <div className=" flex outline outline-1 w-[75%] h-[80px] rounded-md items-center justify-between ">
        <div className=" flex items-center">
          <div className="mr-1 ml-3">{props.index + 1}.</div>
          <div className="w-[60px] bg-amber-200 rounded-full h-[60px] mr-3">{contents.profileImage}</div>
          <div className="mr-3">임시(db연결되면 지워야함):닉네임{contents.nickname}</div>
        </div>

        <div className="mr-3">임시(db연결되면 지워야함):2시간 12분{contents.todoayStudyTime}</div>
        {/* 나중에 분을 시간으로 변환하는 작업 해줘야함 */}
        <div className="mr-3">임시(db연결되면 지워야함):2024-3-12{contents.studyDate}</div>
      </div>
    </>
  );
};

export default RankUI;
