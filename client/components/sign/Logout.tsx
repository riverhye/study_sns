import { useRouter } from 'next/navigation';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();

    router.push('/');
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
};

export default Logout;