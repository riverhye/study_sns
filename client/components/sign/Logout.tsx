import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';


const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: '/' });
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
};

export default Logout;