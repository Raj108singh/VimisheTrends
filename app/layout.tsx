import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// Removed React Query since we're using static data for now
import { Toaster } from '@/components/ui/toaster';
import MobileBottomNav from '@/components/mobile-bottom-nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vimishe Fashion Trends - Premium Children\'s Fashion',
  description: 'Discover comfortable and stylish kids wear at Vimishe Fashion Trends. Quality children\'s clothing for girls, boys, and accessories.',
  keywords: 'kids fashion, children clothing, boys wear, girls wear, kids accessories, children fashion trends',
};

// Using static data for now

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="pb-16 lg:pb-0">
          {children}
        </div>
        <MobileBottomNav />
        <Toaster />
      </body>
    </html>
  );
}