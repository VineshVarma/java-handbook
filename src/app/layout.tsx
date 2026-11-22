import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Java Handbook · Interactive Architecture & JVM Guide',
  description:
    'An interactive Java handbook: each concept is an animated diagram you step through — JVM, OOP, Concurrency, Spring Boot, Microservices, and Cloud Observability.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
