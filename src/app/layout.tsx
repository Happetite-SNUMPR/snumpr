import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Work_Sans } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'SNUMPR Lab',
  description: 'We study visual perception and machine reasoning.',
};

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${workSans.variable} no-scrollbar`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <NuqsAdapter>
          <Navbar />
          {children}
          <Footer />
        </NuqsAdapter>
      </body>
    </html>
  );
}
