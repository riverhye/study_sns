'use client';

import { Inter } from 'next/font/google';

import '@/styles/tailwind.css';
import '@/styles/global.css';
import AuthProvider from '@/components/providers/AuthProvider';
import HeaderLeft from '@/components/header/HeaderLeft';
import HeaderTop from '@/components/header/HeaderTop';
import StoreProvider from '@/components/providers/ReduxProvider';
import React from 'react';
import { WebSocketProvider } from '@/components/providers/SocketContext';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <SocketProvider /> */}
        <WebSocketProvider>
          <header className="flex font-['SansRegular']">
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
        </WebSocketProvider>
      </body>
    </html>
  );
}
