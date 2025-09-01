export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  readTime: number;
  imageUrl?: string;
  published: boolean;
  relatedQuizzes?: string[];
  isPremium?: boolean;
  audioUrl?: string;
  likes?: number;
  price?: number; // For individual article purchase
  // Optional SEO metadata
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
}

export const blogs: Blog[] = [
  {
    id: '1',
    title: 'The Mental Tug-of-War: Understanding Cognitive Dissonance',
    slug: 'mental-tug-of-war-cognitive-dissonance',
    excerpt: 'Why our minds justify contradictions—and how to spot and resolve the tension.',
    content: `Cognitive dissonance is the discomfort we feel when our actions and values don't line up.\n\nThis tension often shows up as quick justifications ("I had no choice"), gradual belief shifts ("maybe this isn't so important"), selective evidence gathering ("I'll look for articles that support me"), identity protection ("this isn't who I am"), or social reality distortion ("everyone does it").\n\nNoticing the patterns gives you back choice. You can pause, name the tension, and decide whether to realign behavior with values—or update values with honesty.\n\nA practical next step: take the Cognitive Dissonance Assessment to map where your tension shows up most and try one small alignment experiment this week.`,
    author: 'MyBeing Research',
    publishedAt: new Date('2025-01-15'),
    tags: ['psychology', 'self-awareness'],
    readTime: 5,
    published: true,
    relatedQuizzes: ['cognitive-dissonance'],
    likes: 0,
    isPremium: false,
  },
  {
    id: '2',
    title: 'Tracking Stress Patterns: A Practical Guide',
    slug: 'tracking-stress-patterns',
    excerpt: 'Simple, research-backed ways to spot stress cycles and intervene early.',
    content: `Stress patterns often emerge subtly—through sleep, energy, or focus changes.\n\nA simple weekly check-in across these dimensions reveals trends you can act on. Write down what you're noticing and the smallest helpful change you can make for the next 7 days.\n\nTry the Stress Patterns quiz to get a baseline and identify one lever that gives you relief without requiring major life changes.`,
    author: 'MyBeing Research',
    publishedAt: new Date('2025-02-04'),
    tags: ['stress', 'habits'],
    readTime: 4,
    published: true,
    likes: 0,
    isPremium: false,
  },
  {
    id: '3',
    title: 'Advanced Behavioral Pattern Recognition',
    slug: 'advanced-behavioral-patterns',
    excerpt: 'Deep dive into unconscious behavioral loops and how to break them.',
    content: `This premium research article explores advanced techniques for identifying and modifying deeply ingrained behavioral patterns. Using cutting-edge neuroscience research and practical frameworks, we'll guide you through a comprehensive analysis of your unconscious habits.\n\nTopics covered:\n- Neuroplasticity and habit formation\n- Advanced pattern interruption techniques\n- Cognitive behavioral therapy applications\n- Mindfulness-based interventions\n- Case studies from clinical practice\n\nThis article includes audio narration and interactive exercises for premium subscribers.`,
    author: 'Dr. MyBeing',
    publishedAt: new Date('2025-02-10'),
    tags: ['premium', 'neuroscience', 'behavior'],
    readTime: 15,
    published: true,
    likes: 0,
    isPremium: true,
    price: 29,
    audioUrl: '/audio/advanced-behavioral-patterns.mp3',
  },
];

export function getBlogBySlug(slug: string) {
  return blogs.find((b) => b.slug === slug);
}
