// Fallback data for when database is not available
// This ensures the app works even without database connection

export const fallbackBlogs = [
  {
    id: '1',
    title: 'Understanding Your Cognitive Patterns',
    slug: 'understanding-cognitive-patterns',
    excerpt: 'Discover how your mind processes information and makes decisions through research-backed insights.',
    content: `# Understanding Your Cognitive Patterns

Cognitive patterns are the mental frameworks that guide how we process information, make decisions, and interpret the world around us. These patterns, developed over years of experience, can either serve us well or hold us back from reaching our full potential.

## What Are Cognitive Patterns?

Cognitive patterns are automatic ways of thinking that our brains use to quickly process information. They include:

- **Attention patterns**: What we notice and what we ignore
- **Processing styles**: How we analyze and organize information  
- **Decision-making frameworks**: The criteria we use to make choices
- **Bias tendencies**: Systematic errors in thinking

## Why Understanding Them Matters

Research shows that people who understand their cognitive patterns are better at:
- Making more objective decisions
- Recognizing when emotions might be clouding judgment
- Adapting their thinking to different situations
- Communicating more effectively with others

Take our Cognitive Patterns Assessment to discover your unique thinking style.`,
    image_url: '/images/blog/cognitive-patterns.jpg',
    tags: ['psychology', 'self-awareness', 'decision-making'],
    published: true,
    published_at: '2024-01-15T00:00:00.000Z',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z',
    author_id: 'dr-n',
    author: 'Dr N',
    readTime: '8 min read'
  },
  {
    id: '2',
    title: 'The Science of Stress Response',
    slug: 'stress-response-mechanisms',
    excerpt: 'Learn about your body\'s stress mechanisms and how to develop healthier coping strategies.',
    content: `# The Science of Stress Response

Stress is an inevitable part of human experience, but understanding how your body and mind respond to stress can be the key to managing it effectively and maintaining your well-being.

## The Physiology of Stress

When you encounter a stressor, your body initiates a complex cascade of physiological responses through the HPA axis (hypothalamic-pituitary-adrenal axis).

## Individual Differences in Stress Response

Research shows significant variation in how people respond to stress based on genetic factors, environmental influences, and personality traits.

Take our Stress Pattern Analysis to identify your personal stress triggers and discover customized strategies.`,
    image_url: '/images/blog/stress-response.jpg',
    tags: ['wellness', 'stress-management', 'health'],
    published: true,
    published_at: '2024-01-10T00:00:00.000Z',
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z',
    author_id: 'dr-n',
    author: 'Dr N',
    readTime: '6 min read'
  },
  {
    id: '3',
    title: 'The Psychology of Behavioral Change',
    slug: 'behavioral-change-psychology',
    excerpt: 'Explore the science behind habit formation and sustainable personal transformation.',
    content: `# The Psychology of Behavioral Change

Understanding how and why we change our behaviors is crucial for personal growth and achieving our goals. This article explores the psychological mechanisms behind lasting behavioral change.

## The Science of Habit Formation

Habits are formed through a neurological loop consisting of a cue, routine, and reward. Understanding this loop is key to creating positive changes.

## Strategies for Sustainable Change

Research-backed approaches for creating lasting behavioral changes include implementation intentions, environmental design, and social accountability.

Discover your behavioral tendencies with our specialized assessments.`,
    image_url: '/images/blog/behavioral-change.jpg',
    tags: ['behavior', 'habits', 'personal-growth'],
    published: true,
    published_at: '2024-01-05T00:00:00.000Z',
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z',
    author_id: 'dr-n',
    author: 'Dr N',
    readTime: '10 min read'
  }
];

export const fallbackQuizzes = [
  {
    id: '1',
    title: 'Cognitive Dissonance Assessment',
    slug: 'cognitive-dissonance-assessment',
    description: 'Discover how aligned your actions are with your core values and beliefs.',
    duration: '8-12 minutes',
    completions: '2.3k+',
    difficulty: 'Beginner',
    category: 'Self-Awareness',
    published: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    author_id: 'dr-n',
    responses: 2300
  },
  {
    id: '2', 
    title: 'Stress Pattern Analysis',
    slug: 'stress-pattern-analysis',
    description: 'Understand your stress triggers and develop personalized coping strategies.',
    duration: '10-15 minutes',
    completions: '1.8k+',
    difficulty: 'Intermediate',
    category: 'Wellness',
    published: true,
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z',
    author_id: 'dr-n',
    responses: 1800
  },
  {
    id: '3',
    title: 'Behavioral Tendencies Quiz',
    slug: 'behavioral-tendencies-quiz', 
    description: 'Explore your natural behavioral patterns and decision-making style.',
    duration: '6-10 minutes',
    completions: '3.1k+',
    difficulty: 'Beginner',
    category: 'Behavior',
    published: true,
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z',
    author_id: 'dr-n',
    responses: 3100
  }
];

export function getFallbackBlogBySlug(slug: string) {
  return fallbackBlogs.find(blog => blog.slug === slug);
}

export function getFallbackQuizBySlug(slug: string) {
  return fallbackQuizzes.find(quiz => quiz.slug === slug);
}
