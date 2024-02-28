//TODO 리덕스에 userId값 저장하기, 아니면 url에서 닉네임 가져오기?
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React from 'react';
interface StudyMyRankProps {
  myRankData?: { rankingDate: string; rankingTime: number };
  badgeData?: { badgeName: string }[];
}
const StudyMyRank = (props: StudyMyRankProps) => {
  const myRankData = props.myRankData;
  let percentage: number | undefined = 0;
  let clientRanking;
  if (myRankData?.rankingTime == undefined) {
    clientRanking = 0;
    percentage = 0;
  } else {
    clientRanking = myRankData?.rankingTime;
    percentage = myRankData?.rankingTime / 12;
  }
  const badgeData = props.badgeData; //뱃지이름을 가진 배열

  return (
    <>
      <div className="flex">
        <div className="mb-9">공부 기록</div>

        <hr />
      </div>

      <div className="flex ">
        <div className="w-[200px]">
          <CircularProgressbar
            value={percentage}
            text={`${clientRanking}/12시간`}
            styles={{ text: { fontSize: '14px' } }}
          />
        </div>
        <div className="ml-3 text-[40px] flex items-center">
          <div className="  ml-5 flex">
            {' '}
            <div className=" font-bold text-main-blue mr-1">{(clientRanking / 60).toFixed(2)}</div>
            {/* 소숫점 2자리수까지만 표현 */}
            <div>시간</div>
          </div>
          {!myRankData?.rankingTime == undefined && <div>{myRankData?.rankingDate}</div>}
          {/*undefined시간 아닐때만 일자가 뜸 */}
        </div>
      </div>
      {/* <div>
        <ul>{badgeData?.map((badge, index) => <li key={index}>{badge.badgeName}</li>)}</ul>
      </div> */}
    </>
  );
};

export default StudyMyRank;
