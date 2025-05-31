import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "DelightPlus MiniGames",
  description: "A collection of fun browser-based mini-games built with Next.js",
  keywords: ["games", "mini-games", "browser games", "web games", "Next.js games"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-zinc-950 text-zinc-50`}
      >
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
