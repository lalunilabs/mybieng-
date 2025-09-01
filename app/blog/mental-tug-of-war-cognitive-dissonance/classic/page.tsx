import { Metadata } from 'next';
import { getBlogBySlug } from '@/data/blogs';
import { ClassicBlogReader } from '@/components/ClassicBlogReader';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'The Mental Tug-of-War: Understanding Cognitive Dissonance | MyBeing',
  description: 'Why our minds justify contradictions—and how to spot and resolve the tension.',
};

export default function ClassicCognitiveDissonnanceBlogPage() {
  const blog = getBlogBySlug('mental-tug-of-war-cognitive-dissonance');
  
  if (!blog) {
    notFound();
  }

  return <ClassicBlogReader blog={blog} />;
}
