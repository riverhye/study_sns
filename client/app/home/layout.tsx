import AuthProvider from '@/components/providers/AuthProvider';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <div className="p-4 mt-10">{children}</div>
      </AuthProvider>
    </>
  );
}
