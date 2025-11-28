'use client';

import localFont from 'next/font/local';
import Footer from '@/components/footer';
import './globals.css';
import Navbar from '@/components/navbar';
import QueryProvider from '@/lib/query-provider';
import { cn } from '@/lib/utils';

const myFont = localFont({
  src: [
    {
      path: '../public/fonts/trap/Trap-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/trap/Trap-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/trap/Trap-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/trap/Trap-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/trap/Trap-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/trap/Trap-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('bg-[#00230F]', myFont.className)}>
        <QueryProvider>
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
