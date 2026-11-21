import { MetadataRoute } from 'next';
import { allLessons } from '@/data/lessons';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://java-internals.vercel.app';

  const lessonEntries: MetadataRoute.Sitemap = allLessons.map((lesson) => ({
    url: `${baseUrl}/lessons/${lesson.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...lessonEntries,
  ];
}
