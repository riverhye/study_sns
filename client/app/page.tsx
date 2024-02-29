'use client';

import HomeFeed from '@/components/feed/HomeFeed';
import SignIn from '@/components/sign/SignIn';
import { useAppSelector } from '@/store/hooks';
import { Metadata } from 'next';
import { useSession } from 'next-auth/react';

// export const metadata: Metadata = {
//   title: {
//     default: 'Home',
//     template: '%s | SNS',
//   },
// };

const HomePage = () => {
  const { data } = useSession();
  const token = useAppSelector(state => state.sign.token);
  const socialToken = data?.user;
  return <>{token || socialToken ? <HomeFeed /> : <SignIn />}</>;
};

export default HomePage;
