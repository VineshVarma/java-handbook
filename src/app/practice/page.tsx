import Link from 'next/link';
import { Coffee, ArrowLeft, Target, Bell } from 'lucide-react';

export const metadata = {
  title: 'Practice · Coming Soon | Java Handbook',
  description: 'Interactive Java practice exercises are coming soon to the Java Handbook.',
};

export default function PracticePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 dark:bg-charcoal-950 text-charcoal-900 dark:text-cream-100 px-6">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-amber-500 dark:bg-amber-400 text-white flex items-center justify-center shadow-lg mb-8">
        <Target className="w-8 h-8" />
      </div>

      {/* Coming Soon Badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-amber-300 dark:border-amber-800">
        <Bell className="w-3 h-3" />
        Coming Soon
      </span>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-mono font-bold text-charcoal-900 dark:text-cream-100 mb-3 text-center">
        Practice Exercises
      </h1>
      <p className="text-sm text-charcoal-500 dark:text-cream-400 text-center max-w-md mb-8 leading-relaxed">
        Interactive coding challenges covering JVM internals, concurrency patterns,
        Spring Boot architecture, and more. We&apos;re building something great.
      </p>

      {/* Back to Curriculum */}
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-sm font-semibold shadow-sm transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Curriculum</span>
      </Link>

      {/* Decorative */}
      <div className="mt-12 flex items-center gap-2 text-xs font-mono text-charcoal-400 dark:text-cream-500">
        <Coffee className="w-3.5 h-3.5" />
        <span>Java Handbook</span>
      </div>
    </div>
  );
}
