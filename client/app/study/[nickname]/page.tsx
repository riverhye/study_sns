/* 
!다이나믹 라우팅->props에 값이 담김
TODO:유저정보 가져오기 (유저닉네임, 팔로잉 팔로워, 내가 팔로우했는지 안했는지 여부)-> 팔로우 버튼 누르면 소켓에 데이터 전송 +db에 저장
TODO:달력표시할 정보 가져오기 - 어떤 요일에 몇시간?-> 누르면 그 날의 투두 정보 나오게
TODO:todo리스트 정보 가져오기,생성 
TODO:업적,랭킹  정보 가져오기 
!콘솔로그 두번뜨는거 설정 방지 해야 할것 같습니다
여기서 api를 한번에 받아온 다음 props로 각각의 컴포넌트로 구조분해해서 넘기기
*/
'use client';
import React, { useEffect } from 'react';
import '../../../type/type';
import axios from 'axios';
import StudyUser from '@/components/studyComponents/studyUser';
import StudyTable from '@/components/studyComponents/studyTable';
import StudyTodo from '@/components/studyComponents/studyTodo';
import StudyMyRank from '@/components/studyComponents/studyMyRank';

// 컴포넌트 : 유저 , 타이머 , 달력 , todo, 랭킹(시간, 업적)

//props 타입
interface propsType {
  params: { nickname: string };
  searchParams: {};
  //추가 예정
}
export default function Study(props: propsType) {
  console.log(props);
  const nickname = props.params.nickname;
  useEffect(() => {
    //api요청: 페이지 렌더됐을경우
    async function fetchData() {
      try {
        const studyPageData = await axios.get(`http://localhost:8080/study/${nickname}`);
      } catch (error) {
        console.error('스터디페이지 데이터 가져오기 실패:', error);
      }
    }

    fetchData();
  }, []);

  //TODO:studyPageData안에 데이터가 담길예정 -> 나눠서 props에 담아 각각의 컴포넌트에게 전달
  return (
    <>
      {/* 테스트 */}
      <div>{nickname}test</div>
      {/* 실제 */}
      <StudyUser />
      <StudyTable />
      <StudyTodo />
      <StudyMyRank />
    </>
  );
}
