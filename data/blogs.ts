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

import { PRICING } from '@/lib/constants';

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
  {
    id: '4',
    title: 'Introducing MyBeing AI: Your Personal Self-Discovery Companion',
    slug: 'mybeing-ai-personal-discovery-companion',
    excerpt: 'Meet your new AI assistant that transforms how you explore quiz results, discover content, and plan your personal growth journey.',
    content: `# Introducing MyBeing AI: Your Personal Self-Discovery Companion

Self-discovery is a deeply personal journey, but it doesn't have to be a lonely one. Today, we're excited to introduce **MyBeing AI** – your intelligent companion designed to help you understand yourself better, explore your quiz results more deeply, and discover personalized content that accelerates your growth.

## Beyond Traditional Quiz Results

Traditional assessments give you a score and send you on your way. We believe that's just the beginning. Your quiz results are rich with insights waiting to be explored, patterns ready to be understood, and actionable steps begging to be taken.

### **Post-Quiz Conversations That Matter**

When you complete a MyBeing assessment, our AI assistant immediately becomes available to help you:

- **Understand Your Results**: Ask questions like "What does this mean for my daily life?" or "How can I work on this pattern?"
- **Get Practical Guidance**: Receive specific, actionable advice tailored to your score and category
- **Explore Patterns**: Dive deeper into the psychological patterns revealed by your assessment
- **Plan Next Steps**: Create a personalized action plan for the week ahead

**No complex forms, no waiting for reports** – just natural conversation about what matters most: your results and your growth.

### **Simple Feedback Collection**

We value your experience. After exploring your results, you can easily provide feedback through a simple star rating and optional comment. This helps us continuously improve our assessments and AI responses to serve you better.

## The Power of Personalized Content Discovery

One of the biggest challenges in self-discovery is knowing what to explore next. Should you take another quiz? Which blog post will actually help? What's the logical next step in your journey?

### **Intelligent Recommendations**

Our AI doesn't just give generic suggestions. It analyzes:
- Your quiz results and patterns
- Your conversation topics and interests  
- Your engagement history
- Research-backed connections between concepts

This means when you ask "What should I read next?" or "Which quiz would help me explore this further?", you get recommendations specifically chosen for your unique situation.

### **Content That Connects**

Every recommendation comes with context:
- **Why this content?** Understanding the reasoning behind suggestions
- **How it relates** to your current results or interests
- **What you'll gain** from engaging with the recommended content
- **Next steps** after consuming the content

## Premium Subscription: Unlocking Your Full Potential

While everyone can access basic AI assistance, our **Premium subscription ($${PRICING.monthly}/month)** transforms the experience into something truly personalized and comprehensive.

### **What's Included in Premium**

**🎯 Monthly Allowances:**
- **2 free quizzes** (under $50 value each)
- **3 premium articles** with advanced research and insights
- **Unlimited AI conversations** with personalized guidance

**📊 Enhanced Features:**
- Personalized content curation based on your interests
- Custom 30-day learning plans tailored to your growth areas
- Subscriber discounts on additional quizzes and articles
- Progress tracking across all your assessments
- Priority recommendations that evolve with your journey

### **Smart Monthly Allowances**

Rather than overwhelming you with unlimited everything, we've designed a thoughtful allowance system:

- **2 Free Quizzes**: Carefully selected assessments under $50 value, perfect for monthly deep-dives
- **3 Premium Articles**: Research-backed content with advanced insights you won't find elsewhere
- **Strategic Pacing**: Encourages reflection and implementation rather than consumption overload

Additional content is available at subscriber discount rates, so you can explore more when you're ready.

## How It All Works Together

### **The Complete Experience**

1. **Take an Assessment**: Start with any of our research-backed quizzes
2. **Explore with AI**: Immediately dive into conversation about your results
3. **Get Recommendations**: Discover related content perfectly matched to your interests
4. **Plan Your Growth**: Create actionable steps for the week ahead
5. **Provide Feedback**: Help us improve through simple rating and comments
6. **Continue Learning**: Follow personalized recommendations to deepen your understanding

### **For Premium Subscribers: The Enhanced Journey**

Premium subscribers experience a fundamentally different level of personalization:

- **Usage Tracking**: See your monthly allowances and plan your exploration strategically
- **Conversation Memory**: Your AI remembers previous discussions and builds on them
- **Cross-Assessment Insights**: Discover patterns across multiple quiz results
- **Proactive Recommendations**: Get suggestions before you even ask
- **Learning Path Optimization**: Continuously refined recommendations based on your engagement

## Your Journey Starts Now

Self-discovery isn't a destination – it's an ongoing conversation with yourself about who you are, who you're becoming, and how you want to show up in the world.

Our AI assistant is here to make that conversation richer, more insightful, and more actionable. Whether you're just starting your self-discovery journey or you're a seasoned explorer looking for deeper insights, MyBeing AI adapts to meet you where you are.

**Ready to begin?** Take your first assessment and start the conversation. Your AI companion is waiting to help you unlock the insights that will transform how you understand yourself.

---

*MyBeing AI represents the next evolution in personal development technology – where artificial intelligence meets authentic self-discovery. Join thousands of users who are already experiencing the difference personalized AI guidance makes in their growth journey.*

**[Start Your First Assessment](/quizzes) | [Subscribe for $${PRICING.monthly}/month](/pricing) | [Chat with AI Now](/chat)**`,
    author: 'MyBeing Research Team',
    publishedAt: new Date('2025-09-04'),
    tags: ['ai', 'self-discovery', 'technology', 'personalization'],
    readTime: 12,
    published: true,
    likes: 0,
    isPremium: false,
    metaTitle: `MyBeing AI: Your Personal Self-Discovery Companion | $${PRICING.monthly}/month Premium Plan`,
    metaDescription: `Discover how MyBeing AI transforms self-discovery with intelligent quiz analysis, personalized recommendations, and a $${PRICING.monthly}/month premium plan including 2 free quizzes and 3 premium articles.`,
    keywords: ['AI assistant', 'self-discovery', 'quiz analysis', 'personalized recommendations', 'personal growth', 'psychology AI', 'behavioral insights', `$${PRICING.monthly} subscription`],
    ogImage: '/images/blog/mybeing-ai-companion.jpg'
  },
];

export function getBlogBySlug(slug: string) {
  return blogs.find((b) => b.slug === slug);
}
