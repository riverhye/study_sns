import AuthProvider from '@/components/providers/AuthProvider';

export default async function NotiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <div className="p-4 mt-10 h-full">{children}</div>
      </AuthProvider>
    </>
  );
}
