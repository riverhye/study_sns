//TODO 리덕스에 userId값 저장하기, 아니면 url에서 닉네임 가져오기?
import React from 'react';
interface StudyMyRankProps {
  myRankData?: { rankingDate: string; rankingTinme: number };
  badgeData?: { badgeName: string }[];
}
const StudyMyRank = (props: StudyMyRankProps) => {
  return <div>studyMyRank</div>;
};

export default StudyMyRank;
