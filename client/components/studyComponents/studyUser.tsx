import '@/styles/tailwind.css';
import axios from 'axios';
interface StudyUserProps {
  userData: {
    nickname: string;
    email: string;
    folling: number;
    follower: number;
  };
}
interface axiosData {
  userId: string;
  followNickname: number;
}
const StudyUser = (props: StudyUserProps) => {
  const userData = props.userData;

  async function pollowController() {
    //팔로우 api요청
    const data: axiosData = {
      userId: userData.nickname,
      followNickname: 123, //!나중에 토큰으로 가져온값으로 수정해야함
    };
    await axios.post(`${process.env.NEXT_PUBLIC_URL}/follow`, data);
  }
  async function unPollowController() {
    //언팔로우 api요청
    const data: axiosData = {
      userId: userData.nickname,
      followNickname: 123, //!나중에 토큰으로 가져온값으로 수정해야함
    };
    await axios.delete(`${process.env.NEXT_PUBLIC_URL}/follow`, { data });
  }
  return (
    <>
      <div className="flex">
        <div>
          <div className="w-10px bg-amber-200 rounded h-10px">
            <div>사진</div>
          </div>
        </div>

        <div>
          <div>닉네임{userData?.nickname}</div>
          <div>이메일{userData?.email}</div>
          <div className="flex">
            <div>팔로잉{userData?.folling}</div>
            <div>팔로워{userData?.follower}</div>
          </div>
        </div>
      </div>
      <div>
        <button onClick={pollowController}>팔로우</button>
        {/* 이미 팔로우한 사람이면 언팔로우가 뜨게 해야함 */}
      </div>
    </>
  );
};

export default StudyUser;
