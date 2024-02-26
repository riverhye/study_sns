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
  followNickname: string | null;
}
const StudyUser = (props: StudyUserProps) => {
  const userData = props.userData;
  const token = localStorage.getItem('accessToken'); //토큰
  async function pollowController() {
    //팔로우 api요청
    const data: axiosData = {
      userId: userData.nickname,
      followNickname: token, //!나중에 토큰으로 가져온값으로 수정해야함
    };
    await axios.post(`${process.env.NEXT_PUBLIC_URL}/follow`, data);
  }
  async function unPollowController() {
    //언팔로우 api요청
    const data: axiosData = {
      userId: userData.nickname,
      followNickname: token, //!나중에 토큰으로 가져온값으로 수정해야함
    };
    await axios.delete(`${process.env.NEXT_PUBLIC_URL}/follow`, { data });
  }
  return (
    <>
      <div className="flex items-center my-2">
        <div>
          <div className="w-[100px] bg-amber-200 rounded-full h-[100px] mr-7">
            <div></div>
          </div>
        </div>

        <div>
          <div className=" text-lg">{userData?.nickname}</div>
          <div className="text-sm">{userData?.email}</div>
          <div className="flex">
            <div>팔로잉{userData?.folling}</div>
            <div>팔로워{userData?.follower}</div>{' '}
            <div>
              <button onClick={pollowController} className="mx-2 bg-black text-white w-[80px] rounded-lg">
                팔로우
              </button>
              {/* 이미 팔로우한 사람이면 언팔로우가 뜨게 해야함 (내페이지면 아무것도 안보이게)
                !트리거를(useState) 하나 만들어서 팔로했는지 안했는지 알아봐야함
              */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyUser;
