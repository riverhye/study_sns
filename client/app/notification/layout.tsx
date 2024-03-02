import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderTop from '@/components/header/HeaderTop';
import AuthProvider from '@/components/providers/AuthProvider';

export default async function NotiLayout({ children }: { children: React.ReactNode }) {
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
