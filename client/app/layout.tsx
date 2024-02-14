import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './tailwind.css';
import './global.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Socket, io } from 'socket.io-client';
import React, { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | SNS',
    default: 'SNS title',
  },
  description: '타임라인 공부 SNS',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
