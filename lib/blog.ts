import { Blog } from '@/data/blogs';

export interface BlogPost extends Blog {
  id: string;
  published: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

// In-memory storage for demo (replace with database in production)
let blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'mental-tug-of-war-cognitive-dissonance',
    title: 'The Mental Tug-of-War: Understanding Cognitive Dissonance',
    excerpt: 'Why our minds justify contradictions—and how to spot and resolve the tension.',
    content: `Cognitive dissonance is the discomfort we feel when our actions and values don't line up.

This tension often shows up as quick justifications ("I had no choice"), gradual belief shifts ("maybe this isn't so important"), selective evidence gathering ("I'll look for articles that support me"), identity protection ("this isn't who I am"), or social reality distortion ("everyone does it").

Noticing the patterns gives you back choice. You can pause, name the tension, and decide whether to realign behavior with values—or update values with honesty.

A practical next step: take the Cognitive Dissonance Assessment to map where your tension shows up most and try one small alignment experiment this week.`,
    tags: ['psychology', 'self-awareness'],
    published: true,
    imageUrl: '/images/cognitive-dissonance.jpg',
    author: 'MyBeing Research',
    publishedAt: new Date('2025-01-15'),
    readTime: 5,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    authorId: 'admin'
  },
  {
    id: '2',
    slug: 'tracking-stress-patterns',
    title: 'Tracking Stress Patterns: A Practical Guide',
    excerpt: 'Simple, research-backed ways to spot stress cycles and intervene early.',
    content: `Stress patterns often emerge subtly—through sleep, energy, or focus changes.

A simple weekly check-in across these dimensions reveals trends you can act on. Write down what you're noticing and the smallest helpful change you can make for the next 7 days.

Try the Stress Patterns quiz to get a baseline and identify one lever that gives you relief without requiring major life changes.`,
    tags: ['stress', 'habits'],
    published: true,
    imageUrl: '/images/stress-patterns.jpg',
    author: 'MyBeing Research',
    publishedAt: new Date('2025-02-04'),
    readTime: 4,
    createdAt: new Date('2025-02-04'),
    updatedAt: new Date('2025-02-04'),
    authorId: 'admin'
  }
];

// Blog management functions
export function getAllBlogPosts(includeUnpublished = false): BlogPost[] {
  if (includeUnpublished) {
    return blogPosts.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  return blogPosts
    .filter(post => post.published)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug && post.published);
}

export function createBlogPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
  const newPost: BlogPost = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  blogPosts.push(newPost);
  return newPost;
}

export function updateBlogPost(id: string, data: Partial<BlogPost>): BlogPost | null {
  const index = blogPosts.findIndex(post => post.id === id);
  if (index === -1) return null;
  
  blogPosts[index] = {
    ...blogPosts[index],
    ...data,
    updatedAt: new Date()
  };
  
  return blogPosts[index];
}

export function deleteBlogPost(id: string): boolean {
  const index = blogPosts.findIndex(post => post.id === id);
  if (index === -1) return false;
  
  blogPosts.splice(index, 1);
  return true;
}

export function toggleBlogPostPublished(id: string): BlogPost | null {
  const post = getBlogPostById(id);
  if (!post) return null;
  
  return updateBlogPost(id, { published: !post.published });
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
