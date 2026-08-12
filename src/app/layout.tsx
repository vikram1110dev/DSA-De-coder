import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'DSA De-coder — Decode the Logic. Visualize the Algorithm. Master DSA.',
  description:
    'AI-powered DSA learning platform. Interactive algorithm visualizers, guided 5-step problem decoder, personalized study plans, smart reminders, and 365-day activity streak heatmap.',
  keywords: [
    'DSA',
    'Data Structures and Algorithms',
    'Algorithm Visualizer',
    'AI Coding Mentor',
    'LeetCode Practice',
    'Google Gemini AI',
    'Placement Preparation',
    'Binary Search',
    'Dynamic Programming',
    'Graphs BFS DFS'
  ],
  authors: [{ name: 'DSA De-coder Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080d1a] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
