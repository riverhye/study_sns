/* 
!다이나믹 라우팅->props에 값이 담김
TODO:유저정보 가져오기 (유저닉네임, 팔로잉 팔로워, 내가 팔로우했는지 안했는지 여부)-> 팔로우 버튼 누르면 소켓에 데이터 전송 +db에 저장
TODO:달력표시할 정보 가져오기 - 어떤 요일에 몇시간?-> 누르면 그 날의 투두 정보 나오게
TODO:todo리스트 정보 가져오기,생성 
TODO:업적,랭킹  정보 가져오기 
여기서 api를 한번에 받아온 다음 props로 각각의 컴포넌트로 구조분해해서 넘기기
*/
'use client';
import React, { useEffect, useState } from 'react';
import '../../../type/type';
import axios from 'axios';
import StudyUser from '@/components/studyComponents/StudyUser';
import StudyTable from '@/components/studyComponents/StudyTable';
import StudyTodo from '@/components/studyComponents/StudyTodo';
import StudyMyRank from '@/components/studyComponents/StudyMyRank';

// 컴포넌트 : 유저 , 타이머 , 달력 , todo, 랭킹(시간, 업적)

//props 타입
import { NicknamePropsType } from '../../../type/type';
//Study페이지 조회 데이터 타입
interface StudyPageData {
  user: {
    userimage: string;
    nickname: string;
    email: string;
    followingId: number;
    followerId: number;
  };
  studyTable: {
    todayStudyTime: number;
    studyDate: string;
  }[];
  todo: {
    todoDate: string;
    todoContent: string;
  }[];
  myRanking: {
    rankingDate: string;
    rankingTime: number;
  };
  badge: { badgeName: string }[];
}
export default function Study(props: NicknamePropsType) {
  const nickname = props.params.nickname;
  const token = localStorage.getItem('accessToken');
  const [studyPageData, setStudyPageData] = useState<StudyPageData>({
    user: { nickname: 'tNickname', email: 'tEmail@dot.com', followingId: 0, followerId: 0, userimage: '' },
    studyTable: [],
    todo: [],
    myRanking: { rankingDate: '', rankingTime: 0 },
    badge: [],
  });
  let folloeres;
  //url(=유저닉네임)이 바뀔때마다 새로 요청
  useEffect(() => {
    //api요청: 페이지 렌더됐을경우
    async function fetchData() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/study/${nickname}`);
        setStudyPageData(res.data);
        console.log('유저데이터', res.data);
      } catch (error) {
        console.error('스터디페이지 데이터 가져오기 실패:', error);
      }
      try {
        folloeres = await axios.get(`${process.env.NEXT_PUBLIC_URL}/follow/checkfollow/${nickname}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('팔로우여부', folloeres);
      } catch (error) {
        console.log('팔로우여부에러', error);
      }
    }

    fetchData();
  }, [nickname]);

  //TODO:studyPageData안에 데이터가 담길예정 -> 나눠서 props에 담아 각각의 컴포넌트에게 전달(Clear)
  return (
    <>
      <div className=" ml-[50px]">
        <StudyUser userData={studyPageData.user} />
        <div className="my-6">Todo</div>
        <div className="flex ">
          <div className="mr-10 ">
            <StudyTable tableData={studyPageData.studyTable} />
          </div>
          <div className="mt-2 w-[100%] ">
            <StudyTodo todoData={studyPageData.todo} nickname={nickname} />
          </div>
        </div>

        <div className="my-5">
          <StudyMyRank myRankData={studyPageData.myRanking} badgeData={studyPageData.badge} />
        </div>
      </div>
    </>
  );
}
