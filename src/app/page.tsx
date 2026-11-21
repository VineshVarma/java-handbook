import { allLessons, modules } from '@/data/lessons';
import { LessonLayout } from '@/components/layout/LessonLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Java Internals · Interactive Java Concepts & Architecture',
  description:
    'An interactive Java course: each concept is an animated diagram you step through — JVM, OOP, Concurrency, Spring Boot, Microservices, and Cloud Observability.',
  openGraph: {
    title: 'Java Internals · Interactive Java Concepts & Architecture',
    description:
      'An interactive Java course: each concept is an animated diagram you step through — JVM, OOP, Concurrency, Spring Boot, Microservices, and Cloud Observability.',
    url: 'https://java-internals.vercel.app',
    siteName: 'Java Internals',
  },
};

export default function HomePage() {
  return (
    <>
      {/* Semantic Server Rendered HTML for Web Crawlers & Reviewers */}
      <noscript>
        <div className="p-8 max-w-4xl mx-auto space-y-6 font-sans">
          <h1 className="text-3xl font-bold font-mono">
            Java Internals — Interactive Java Concepts & Architecture
          </h1>
          <p className="text-base text-gray-700">
            27 interactive deep-dive lessons covering JVM internal mechanics, memory models, garbage collection algorithms, modern concurrency, Spring Boot request lifecycles, and cloud observability.
          </p>

          <nav aria-label="Curriculum Modules">
            {modules.map((m) => (
              <div key={m.id} className="mb-6">
                <h2 className="text-xl font-bold font-mono border-b pb-1 mb-2">
                  {m.title}
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {m.lessons.map((l) => (
                    <li key={l.slug}>
                      <a href={`/lessons/${l.slug}`} className="text-emerald-700 underline font-semibold">
                        {l.title}
                      </a>{' '}
                      — <span className="text-gray-600 text-sm">{l.subtitle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </noscript>

      {/* Interactive Single-Page Studio */}
      <LessonLayout initialLessonSlug="how-java-runs" />
    </>
  );
}
