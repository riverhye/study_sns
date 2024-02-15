import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/tailwind.css';
import '@/styles/global.css';
import AuthProvider from '@/components/providers/AuthProvider';
import SocketProvider from '@/components/providers/SocketProvider';
import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderTop from '@/components/header/HeaderTop';

import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | SNS',
    default: 'SNS',
  },
  description: '타임라인 공부 SNS',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SocketProvider /> */}
        <header className="flex">
          <HeaderLeft />
          <div className="flex flex-col flex-grow overflow-y-auto">
            <HeaderTop />
            <div className="flex-grow p-4 bg-gray-100">
              <AuthProvider>{children}</AuthProvider>
            </div>
          </div>
        </header>
      </body>
    </html>
  );
}
