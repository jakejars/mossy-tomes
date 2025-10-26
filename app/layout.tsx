import type { Metadata } from 'next';
import './globals.css'; // This imports your correct CSS file
import Sidebar from '@/components/Sidebar';
import BackgroundAnimation from '@/components/BackgroundAnimation';

export const metadata: Metadata = {
  title: 'Mossy Tomes',
  description: 'A sanctuary for storytellers, game masters, and worldbuilders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Background effects are fixed and self-managing */}
        <BackgroundAnimation />
        <div className="noiseOverlay" />
        
        {/* Sidebar for navigation */}
        <Sidebar />

        {/* Content wrapper with padding to avoid sidebar */}
        {/* CHANGED: Replaced div with main tag */}
        <main className="content-wrapper md:pl-64">
          {children}
        </main>
      </body>
    </html>
  );
}