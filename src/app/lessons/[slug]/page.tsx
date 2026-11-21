import { allLessons, getLessonBySlug } from '@/data/lessons';
import { LessonLayout } from '@/components/layout/LessonLayout';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return allLessons.map((l) => ({
    slug: l.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) {
    return {
      title: 'Lesson Not Found | Java Internals',
      description: 'The requested Java Internals lesson was not found.',
    };
  }

  return {
    title: `${lesson.title} | Java Internals`,
    description: lesson.subtitle,
    openGraph: {
      title: `${lesson.title} | Java Internals`,
      description: lesson.subtitle,
      url: `https://java-internals.vercel.app/lessons/${lesson.slug}`,
      siteName: 'Java Internals',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${lesson.title} | Java Internals`,
      description: lesson.subtitle,
    },
  };
}

export default function LessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) {
    notFound();
  }

  return (
    <>
      {/* Semantic SSR content for SEO, web crawlers, and link previews */}
      <noscript>
        <article className="p-8 max-w-3xl mx-auto space-y-4 font-sans">
          <h1 className="text-2xl font-bold font-mono">{lesson.title}</h1>
          <p className="text-sm text-gray-700">{lesson.subtitle}</p>
          <div className="text-xs text-gray-500">
            <span>Difficulty: {lesson.difficulty}</span> · <span>Duration: {lesson.duration}</span> · <span>Module: {lesson.moduleTitle}</span>
          </div>

          <section className="mt-4">
            <h2 className="text-lg font-bold font-mono">What You'll Learn:</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {lesson.youllLearn.map((y, idx) => (
                <li key={idx}>{y}</li>
              ))}
            </ul>
          </section>

          <section className="mt-6 space-y-4">
            <h2 className="text-lg font-bold font-mono">Lesson Steps:</h2>
            {lesson.steps.map((s, idx) => (
              <div key={idx} className="border-b pb-4">
                <h3 className="font-bold text-sm font-mono">Step {idx + 1}: {s.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{s.subtitle}</p>
                <div className="text-xs whitespace-pre-wrap">{s.content}</div>
                {s.keyIdea && (
                  <p className="mt-2 text-xs font-semibold text-emerald-800">
                    Key Idea: {s.keyIdea}
                  </p>
                )}
              </div>
            ))}
          </section>
        </article>
      </noscript>

      {/* Interactive client application */}
      <LessonLayout initialLessonSlug={params.slug} />
    </>
  );
}
