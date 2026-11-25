import Link from 'next/link';
import { Coffee, ArrowLeft, FileText, Bell } from 'lucide-react';

export const metadata = {
  title: 'Cheatsheets · Coming Soon | Java Handbook',
  description: 'Java cheatsheets for quick reference are coming soon to the Java Handbook.',
};

export default function CheatsheetsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-100 dark:bg-charcoal-950 text-charcoal-900 dark:text-cream-100 px-6">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-sky-500 dark:bg-sky-400 text-white flex items-center justify-center shadow-lg mb-8">
        <FileText className="w-8 h-8" />
      </div>

      {/* Coming Soon Badge */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-sky-300 dark:border-sky-800">
        <Bell className="w-3 h-3" />
        Coming Soon
      </span>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-mono font-bold text-charcoal-900 dark:text-cream-100 mb-3 text-center">
        Java Cheatsheets
      </h1>
      <p className="text-sm text-charcoal-500 dark:text-cream-400 text-center max-w-md mb-8 leading-relaxed">
        Quick-reference cards for Collections, Stream API, Concurrency, Spring Boot
        annotations, JVM flags, and more. Designed for interviews and daily use.
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
