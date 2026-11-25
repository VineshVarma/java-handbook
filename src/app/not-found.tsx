import Link from 'next/link';
import { Coffee, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 dark:bg-charcoal-950 text-charcoal-900 dark:text-cream-100 px-6">
      {/* Brand Icon */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-lg mb-8">
        <Coffee className="w-8 h-8" />
      </div>

      {/* 404 Heading */}
      <h1 className="text-6xl font-mono font-bold text-charcoal-900 dark:text-cream-100 mb-3">
        404
      </h1>
      <p className="text-lg font-mono text-charcoal-600 dark:text-cream-300 mb-2">
        Page Not Found
      </p>
      <p className="text-sm text-charcoal-500 dark:text-cream-400 text-center max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to learning Java.
      </p>

      {/* Back to Curriculum */}
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-sm font-semibold shadow-sm transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Curriculum</span>
      </Link>

      {/* Decorative Bottom Text */}
      <p className="mt-12 text-xs font-mono text-charcoal-400 dark:text-cream-500">
        Java Handbook · Interactive Architecture &amp; JVM Guide
      </p>
    </div>
  );
}
