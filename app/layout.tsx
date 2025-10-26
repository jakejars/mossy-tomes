import type { Metadata } from 'next';
import './globals.css';
import BackgroundAnimation from '../components/BackgroundAnimation';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'Mossy Tomes - TTRPG Tools & Worldbuilding',
  description: 'A sanctuary for storytellers, game masters, and worldbuilders seeking inspiration and practical tools for their tabletop adventures.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BackgroundAnimation />
        <Sidebar />
        <div className="content-wrapper md:ml-64">
          {children}
        </div>
      </body>
    </html>
  );
}
