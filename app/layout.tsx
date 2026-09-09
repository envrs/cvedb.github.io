import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: { default: 'CVEDB | Vulnerability Intelligence', template: '%s | CVEDB' },
  description: 'Open vulnerability intelligence for CVE coverage, scoring, weaknesses, products, and CNA activity.',
};

export const viewport: Viewport = { themeColor: '#080b10', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <Navigation />
        <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
