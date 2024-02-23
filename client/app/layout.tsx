import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/tailwind.css';
import '@/styles/global.css';
import AuthProvider from '@/components/providers/AuthProvider';
import SocketProvider from '@/components/providers/SocketProvider';
import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderTop from '@/components/header/HeaderTop';
import StoreProvider from '@/components/providers/ReduxProvider';
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
          <StoreProvider>
            <HeaderLeft />
            <div className="flex flex-col overflow-y-auto">
              <HeaderTop />
              <div className="p-4 mt-10">
                <AuthProvider>{children}</AuthProvider>
              </div>
            </div>
          </StoreProvider>
        </header>
      </body>
    </html>
  );
}
