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
  followId: string;
}
const StudyUser = (props: StudyUserProps) => {
  const userData = props.userData;
  const token = localStorage.getItem('accessToken'); //토큰
  async function pollowController() {
    //팔로우 api요청
    const data: axiosData = {
      followId: userData.nickname,
    };
    await axios.post(`${process.env.NEXT_PUBLIC_URL}/follow`, data, { headers: { Authorization: `Bearer ${token}` } });
  }
  async function unPollowController() {
    //언팔로우 api요청
    const data: axiosData = {
      followId: userData.nickname,
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
              {}
              <button
                onClick={pollowController}
                className="w-20 h-[30px] ml-3 rounded-md bg-strong-yellow active:filter-none shadow-md transform active:scale-75 transition-transform">
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
