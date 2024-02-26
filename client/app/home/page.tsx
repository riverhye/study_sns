import HomeFeed from '@/components/feed/HomeFeed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

const UserMainPage = () => {
  return (
    <>
      <HomeFeed />
    </>
  );
};

export default UserMainPage;
