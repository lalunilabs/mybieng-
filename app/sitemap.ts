import { MetadataRoute } from 'next';
import { blogs } from '@/data/blogs';
import { quizzes } from '@/data/quizzes';

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.in';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/quizzes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/research`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Blog posts
  const blogPages = blogs
    .filter(blog => blog.published)
    .map(blog => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: blog.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // Quiz pages
  const quizPages = quizzes
    .filter(quiz => quiz.published)
    .map(quiz => ({
      url: `${BASE_URL}/quizzes/${quiz.slug}`,
      lastModified: new Date(quiz.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  return [...staticPages, ...blogPages, ...quizPages];
}
