import '@/styles/tailwind.css';
import axios from 'axios';
import { useWebSocket } from '../providers/SocketContext';

interface StudyUserProps {
  userData: {
    userimage: string;
    nickname: string;
    email: string;
    followingId: number;
    followerId: number;
  };
  isfollowp: boolean | undefined;
}
interface axiosData {
  followId: string;
}
const StudyUser = (props: StudyUserProps) => {
  //소켓연결
  const { socket } = useWebSocket();
  const isfollow = props.isfollowp;
  const userData = props.userData;
  const token = localStorage.getItem('accessToken'); //토큰
  async function pollowController() {
    //팔로우 api요청
    // const data: axiosData = {
    //   followId: userData.nickname,
    // };
    // await axios.post(`${process.env.NEXT_PUBLIC_URL}/follow`, data, { headers: { Authorization: `Bearer ${token}` } });
    if (socket) {
      //소켓이 연결 되어있다면,
      //팔로우 요청
      try {
        const follow = { action: 'follow', targetNickname: `${userData.nickname}` };

        socket.send(JSON.stringify(follow));
        console.log(follow);
        console.log('팔로우 요청은 들어가긴함 .,. ㅎㅎ');
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function unPollowController() {
    //언팔로우 api요청
    // const data: axiosData = {
    //   followId: userData.nickname,
    // };
    // await axios.delete(`${process.env.NEXT_PUBLIC_URL}/follow`, { data });
  }
  return (
    <>
      <div className="flex items-center my-2">
        <div>
          <div>
            <img
              src={userData.userimage}
              alt="Profile"
              className="w-[100px] bg-amber-200 rounded-full h-[100px] mr-7  "
            />
          </div>
        </div>

        <div>
          <div className=" text-lg">{userData?.nickname}</div>
          <div className="text-sm">{userData?.email}</div>
          <div className="flex">
            <div className="mr-2">팔로잉{userData?.followingId} </div>
            <div>팔로워{userData?.followerId}</div>{' '}
            <div>
              {!isfollow && (
                <button
                  onClick={pollowController}
                  className="w-20 h-[30px] ml-3 rounded-md bg-strong-yellow active:filter-none shadow-md transform active:scale-75 transition-transform">
                  팔로우
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyUser;
