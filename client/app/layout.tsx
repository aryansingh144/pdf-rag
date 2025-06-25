// app/layout.tsx
import type { Metadata } from 'next';
import { ClerkProvider, SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './components/ThemeContext';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'AI PDF Assistant',
  description: 'Chat with your uploaded PDF document',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <html lang="en" className="h-full">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300`}
          >
            <SignedOut>
              <div className="min-h-screen flex items-center justify-center">
                <SignUpButton />
              </div>
            </SignedOut>
            <SignedIn>{children}</SignedIn>
          </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
