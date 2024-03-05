import AuthProvider from '@/components/providers/AuthProvider';

export default async function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <div className="p-4 mt-10 h-full w-full">{children}</div>
      </AuthProvider>
    </>
  );
}
