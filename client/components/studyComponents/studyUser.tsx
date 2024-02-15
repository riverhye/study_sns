// !나중에 버튼 지금 접속한 사람이랑 id같은지 비교후 버튼 생성
import '@/styles/tailwind.css';
interface StudyUserProps {
  userData?: {
    nickname: string;
    email: string;
    folling: number;
    follower: number;
  };
}

const StudyUser = (props: StudyUserProps) => {
  const data = props.userData;
  return (
    <>
      <div className="flex">
        <div>
          <div className="w-10px bg-amber-200 rounded h-10px">
            <div>사진</div>
          </div>
        </div>

        <div>
          <div>닉네임{data?.nickname}</div>
          <div>이메일{data?.email}</div>
          <div className="flex">
            <div>팔로잉{data?.folling}</div>
            <div>팔로워{data?.follower}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyUser;
