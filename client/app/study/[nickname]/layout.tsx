import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderTop from '@/components/header/HeaderTop';
import AuthProvider from '@/components/providers/AuthProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Study',
    template: '%s | SNS',
  },
};

export default async function StudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex font-['SansRegular']">
        <AuthProvider>
          <HeaderLeft />
          <div className="flex flex-col overflow-y-auto">
            <HeaderTop />
            <div className="p-4 mt-10 h-full">{children}</div>
          </div>
        </AuthProvider>
      </header>
    </>
  );
}
