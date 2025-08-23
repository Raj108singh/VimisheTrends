import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from './providers/query-provider';
import { Toaster } from '../components/ui/toaster';
import MobileBottomNav from '../components/mobile-bottom-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vimishe Fashion Trends - Premium Children\'s Fashion',
  description: 'Discover the latest trends in children\'s fashion with our premium collection of clothes, shoes, and accessories.',
  keywords: 'children fashion, kids clothing, trendy clothes, premium fashion',
  authors: [{ name: 'Vimishe Fashion Trends' }],
  openGraph: {
    title: 'Vimishe Fashion Trends - Premium Children\'s Fashion',
    description: 'Discover the latest trends in children\'s fashion with our premium collection of clothes, shoes, and accessories.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vimishe Fashion Trends - Premium Children\'s Fashion',
    description: 'Discover the latest trends in children\'s fashion with our premium collection of clothes, shoes, and accessories.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <div className="pb-16 lg:pb-0">
            {children}
          </div>
          <MobileBottomNav />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}