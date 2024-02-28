'use client';

import HomeFeed from '@/components/feed/HomeFeed';
import SignIn from '@/components/sign/SignIn';
import { useAppSelector } from '@/store/hooks';
import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: {
//     default: 'Home',
//     template: '%s | SNS',
//   },
// };

const HomePage = () => {
  const token = useAppSelector(state => state.sign.token);
  return <>{token ? <HomeFeed /> : <SignIn />}</>;
};

export default HomePage;
