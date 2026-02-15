import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNUMPR Lab",
  description: "어쩌고저쩌고",
};

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Regular, Medium, SemiBold
  style: ["normal", "italic"],
  variable: "--font-figtree",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={figtree.variable}>
      <Navbar />
      <body>{children}</body>
    </html>
  );
}
