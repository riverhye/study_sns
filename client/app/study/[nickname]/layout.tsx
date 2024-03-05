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
      <AuthProvider>
        <div className="p-4 mt-10 h-full">{children}</div>
      </AuthProvider>
    </>
  );
}
