import SignIn from '@/components/sign/SignIn';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Home',
    template: '%s | SNS',
  },
};

const HomePage = () => {
  return (
    <>
      <SignIn />
    </>
  );
};

export default HomePage;
