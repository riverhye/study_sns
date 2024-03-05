import AuthProvider from '@/components/providers/AuthProvider';
import HomeComponent from '@/components/sign/HomeComponent';
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
      <AuthProvider>
        <div className="p-4 mt-10 h-full w-full">
          <HomeComponent />
        </div>
      </AuthProvider>
    </>
  );
};

export default HomePage;
