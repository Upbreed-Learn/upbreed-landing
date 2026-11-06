'use client';
import Splash from '@/components/splash';

import localFont from 'next/font/local';
import Footer from '@/components/footer';
import './globals.css';
import QueryProvider from '@/lib/query-provider';
import { cn } from '@/lib/utils';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import ContactUs from '../components/contact-us';
import Gifts from '../components/gifts';
import Navbar from '@/components/navbar';
import AuthPages from '@/components/auth';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';

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

// Desktop: show the site at 90% size, and shrink it further on screens narrower than the 1280px designs.
const SITE_SCALE = 0.9;
// Zooms the page content only (not the whole document), so pop-up menus, dialogs and dropdowns,
// which open outside the content, are positioned correctly under the button that opened them.
// Runs from inside #site-zoom-root, before the page paints.
const FIT_TO_DESIGN = `(function(){var d=document.currentScript.parentElement;function f(){var w=window.innerWidth;var z=w>=1024?${SITE_SCALE}*Math.min(1,w/1280):1;d.style.zoom=z===1?'':String(z);d.style.setProperty('--site-zoom',String(z));}f();window.addEventListener('resize',f);})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('bg-[#00230F]', myFont.className)}>
        <Splash />
        <QueryProvider>
          <Suspense>
            <NuqsAdapter>
              <AuthPages />
              {/* The designs are drawn for a 1280px-wide screen: on laptops, scale the content to 90%
                  so it looks like the design instead of oversized. */}
              <div id="site-zoom-root" suppressHydrationWarning>
                <script dangerouslySetInnerHTML={{ __html: FIT_TO_DESIGN }} />
                <Navbar />
                <main className="pt-22.25">{children}</main>
                <Footer />
              </div>
              <ContactUs />
              <Gifts />
              <Toaster />
            </NuqsAdapter>
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
