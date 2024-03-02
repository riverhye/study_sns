import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderTop from '@/components/header/HeaderTop';
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
      <header className="flex font-['SansRegular']">
        <AuthProvider>
          <HeaderLeft />
          <div className="flex flex-col overflow-y-auto">
            <HeaderTop />
            <div className="p-4 mt-10 h-full w-full">
              <HomeComponent />
            </div>
          </div>
        </AuthProvider>
      </header>
    </>
  );
};

export default HomePage;
