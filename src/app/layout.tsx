import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'DSA De-coder — Decode the Logic. Visualize the Algorithm. Master DSA.',
  description:
    'AI-powered DSA learning platform with interactive algorithm visualizers, guided 5-step problem decoder, personalized study plans, and 365-day activity streak heatmap.',
  keywords: [
    'DSA', 'Data Structures and Algorithms', 'Algorithm Visualizer',
    'AI Coding Mentor', 'LeetCode Practice', 'Placement Preparation',
  ],
  authors: [{ name: 'DSA De-coder' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-bg-primary text-text-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
