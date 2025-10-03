import type { Metadata } from 'next';
import { MagazineArticleReader } from '@/components/readers/MagazineArticleReader';

export const metadata: Metadata = {
  title: 'Magazine Reader Demo | MyBeing',
  description: 'Experience our magazine-style article reader with flip pages and sidebar content.',
};

// Sample article data
const sampleArticle = {
  id: 'demo-article',
  title: 'Understanding Your Behavioral Patterns Through Self-Reflection',
  excerpt: 'Discover how daily self-reflection can reveal hidden patterns in your behavior and lead to meaningful personal growth.',
  content: `
    <p>Self-reflection is one of the most powerful tools for understanding our behavioral patterns and fostering personal growth. In this comprehensive guide, we'll explore how you can develop a deeper understanding of yourself through structured reflection practices.</p>

    <h2>The Science Behind Self-Reflection</h2>
    <p>Research in behavioral psychology shows that individuals who engage in regular self-reflection demonstrate improved self-awareness, better decision-making capabilities, and enhanced emotional regulation. This process allows us to step back from our automatic responses and examine the underlying patterns that drive our behavior.</p>

    <p>When we take time to reflect on our daily experiences, we begin to notice recurring themes in our thoughts, emotions, and actions. These patterns often reveal important insights about our values, motivations, and areas for growth.</p>

    <h2>Building a Reflection Practice</h2>
    <p>Creating a sustainable reflection practice doesn't require hours of meditation or complex techniques. Simple, consistent practices can yield profound insights over time.</p>

    <p>Start with just five minutes each evening to review your day. Ask yourself: What emotions did I experience? What situations triggered strong reactions? How did I respond to challenges? What patterns do I notice in my behavior?</p>

    <h2>Pattern Recognition in Daily Life</h2>
    <p>As you develop your reflection practice, you'll begin to identify patterns that might have previously gone unnoticed. Perhaps you notice that you feel more creative in the morning, or that certain types of conversations drain your energy while others energize you.</p>

    <p>These insights become the foundation for making intentional changes in your life. When you understand your patterns, you can work with them rather than against them, leading to more authentic and fulfilling experiences.</p>

    <h2>The Role of Environment</h2>
    <p>Your environment plays a crucial role in shaping your behavioral patterns. The spaces you inhabit, the people you interact with, and the activities you engage in all influence your thoughts, emotions, and actions in subtle but significant ways.</p>

    <p>Through reflection, you can begin to identify which environmental factors support your well-being and which ones detract from it. This awareness allows you to make conscious choices about how you structure your life.</p>

    <h2>Longitudinal Self-Discovery</h2>
    <p>The most valuable insights often emerge over weeks and months of consistent reflection. Patterns that aren't visible day-to-day become clear when viewed over longer time periods.</p>

    <p>Consider keeping a simple journal or using a reflection app to track your observations over time. Look for seasonal patterns, recurring challenges, and gradual shifts in your thinking and behavior.</p>

    <h2>Moving from Awareness to Action</h2>
    <p>Self-reflection is most valuable when it leads to positive action. Once you've identified patterns in your behavior, you can begin to experiment with small changes that align with your values and goals.</p>

    <p>Remember that change is a gradual process. Be patient with yourself as you work to integrate new insights into your daily life. The goal isn't perfection, but rather a deeper understanding of yourself and more intentional living.</p>

    <p>Through consistent self-reflection and pattern recognition, you can develop a more authentic relationship with yourself and create a life that truly reflects your values and aspirations.</p>
  `,
  author: 'Dr. Niharika',
  publishedAt: '2025-09-30',
  readTime: 8,
  tags: ['Self-Reflection', 'Behavioral Psychology', 'Personal Growth', 'Pattern Recognition'],
  imageUrl: '/images/reflection-article.jpg',
  isPremium: false
};

// Sample suggested articles
const suggestedArticles = [
  {
    id: 'article-1',
    title: 'The Psychology of Daily Habits',
    excerpt: 'How small daily habits shape our long-term behavioral patterns.',
    content: '',
    author: 'Dr. Niharika',
    publishedAt: '2025-09-25',
    readTime: 6,
    tags: ['Habits', 'Psychology'],
    imageUrl: '/images/habits-article.jpg'
  },
  {
    id: 'article-2',
    title: 'Energy Patterns Throughout the Day',
    excerpt: 'Understanding your natural energy rhythms for better productivity.',
    content: '',
    author: 'Dr. Niharika',
    publishedAt: '2025-09-20',
    readTime: 5,
    tags: ['Energy', 'Productivity'],
    imageUrl: '/images/energy-article.jpg'
  },
  {
    id: 'article-3',
    title: 'Emotional Regulation Techniques',
    excerpt: 'Research-backed strategies for managing emotional responses.',
    content: '',
    author: 'Dr. Niharika',
    publishedAt: '2025-09-15',
    readTime: 7,
    tags: ['Emotions', 'Regulation'],
    imageUrl: '/images/emotions-article.jpg'
  }
];

export default function MagazineDemoPage() {
  return (
    <MagazineArticleReader 
      article={sampleArticle}
      suggestedArticles={suggestedArticles}
    />
  );
}
