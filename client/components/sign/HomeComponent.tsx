'use client';

import { useAppSelector } from '@/store/hooks';
import SignIn from './SignIn';
import HomeFeed from '../feed/HomeFeed';

const HomeComponent = () => {
  const token = useAppSelector(state => state.sign.token);
  return <>{token ? <HomeFeed /> : <SignIn />}</>;
};

export default HomeComponent;
