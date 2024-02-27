import { useRouter } from 'next/navigation';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('nickname');
    localStorage.removeItem('user_id');
    localStorage.removeItem('accessToken');

    router.push('/');
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
};

export default Logout;