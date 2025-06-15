import 'react-photo-view/dist/react-photo-view.css';
import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { TokenRefresher } from '@/app/_providers/TokenRefresher';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '快樂記帳',
  description: '輕鬆掌握生活收支',
  icons: {
    icon: '/logo.png',
  },
  keywords: ['記帳', '理財', '支出管理', '收入記錄', '快樂記帳'],
  authors: [{ name: 'Briony', url: 'https://coin-tracker-eosin.vercel.app/' }],
  openGraph: {
    title: '快樂記帳',
    description: '輕鬆掌握生活收支，打造專屬你的財務自由。',
    url: 'https://coin-tracker-eosin.vercel.app/',
    siteName: '快樂記帳',
    images: [
      {
        url: 'https://coin-tracker-eosin.vercel.app/logo.png',
        width: 1200,
        height: 630,
        alt: '快樂記帳預覽圖',
      },
    ],
    locale: 'zh_TW',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TokenRefresher />
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
