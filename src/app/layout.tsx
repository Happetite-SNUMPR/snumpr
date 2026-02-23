import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import localFont from 'next/font/local';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'SNUMPR Lab',
  description: 'We study visual perception and machine reasoning.',
};

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600'], // Regular, Medium, SemiBold
  style: ['normal', 'italic'],
  variable: '--font-figtree',
});

const ppFormula = localFont({
  src: "../fonts/PPFormula-Medium.woff2",
  variable: "--font-ppformula",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${figtree.variable} ${ppFormula.variable} no-scrollbar`}>
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
