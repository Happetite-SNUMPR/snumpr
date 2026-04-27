import type { Metadata, Viewport } from 'next';
import { Figtree, Work_Sans } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'SNUMPR Lab',
  description: 'We study visual perception and machine reasoning.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
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
    <html lang="ko" className={`${figtree.variable} ${workSans.variable}`}>
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
