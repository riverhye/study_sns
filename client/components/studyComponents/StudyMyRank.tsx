//TODO 리덕스에 userId값 저장하기, 아니면 url에서 닉네임 가져오기?
import React from 'react';
interface StudyMyRankProps {
  myRankData?: { rankingDate: string; rankingTinme: number };
  badgeData?: { badgeName: string }[];
}
const StudyMyRank = (props: StudyMyRankProps) => {
  const myRankData = props.myRankData;
  const badgeData = props.badgeData; //뱃지이름을 가진 배열
  return (
    <>
      <div>
        랭킹(젤 공부 많이 한 날):{myRankData?.rankingDate}에{myRankData?.rankingTinme}시간 했습니다
      </div>
      <div>
        <ul>{badgeData?.map((badge, index) => <li key={index}>{badge.badgeName}</li>)}</ul>
      </div>
    </>
  );
};

export default StudyMyRank;
