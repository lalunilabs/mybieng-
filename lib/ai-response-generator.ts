import { 
  QuizResults, 
  UserSubscription, 
  ChatResponse, 
  ContentRecommendations 
} from '@/types/ai-chat';
import { 
  calculateSubscriptionLimits,
  getRelatedContent,
  getPersonalizedQuizRecommendations,
  getPersonalizedBlogRecommendations,
  ChatError
} from '@/lib/ai-chat-utils';
import { quizzes } from '@/data/quizzes';
import { blogs } from '@/data/blogs';

export function generateQuizResultsResponse(
  message: string,
  quizResults: QuizResults
): ChatResponse {
  const lowerMessage = message.toLowerCase();
  
  // Score interpretation
  if (lowerMessage.includes('mean') || lowerMessage.includes('interpret')) {
    return {
      response: `Your score of ${quizResults.score}/${quizResults.maxScore} in the "${quizResults.band.label}" category suggests ${quizResults.band.description.toLowerCase()}\n\nThis indicates specific patterns in how you handle the situations covered in this assessment. The key insight is understanding how this affects your daily decision-making and self-awareness.`,
      recommendations: getRelatedContent(quizResults.quizTitle)
    };
  }
  
  // Weekly actions and focus
  if (lowerMessage.includes('week') || lowerMessage.includes('daily') || lowerMessage.includes('focus')) {
    return {
      response: `Based on your results, here's what to focus on this week:\n\n${quizResults.band.advice}\n\n**This Week's Action Plan:**\n1. **Awareness**: Notice when the patterns from your quiz show up\n2. **Reflection**: Spend 5 minutes daily noting what you observed\n3. **Small experiment**: Try one small change in how you respond\n4. **Track progress**: Notice what feels different\n\nStart small - awareness is the first step to change.`,
      recommendations: getRelatedContent(quizResults.quizTitle)
    };
  }
  
  // Content recommendations
  if (lowerMessage.includes('content') || lowerMessage.includes('read') || lowerMessage.includes('related')) {
    const recommendations = getRelatedContent(quizResults.quizTitle);
    return {
      response: `Based on your ${quizResults.quizTitle} results, I've found some content that might help deepen your understanding:\n\n**Why these recommendations?**\nYour score suggests you're in the "${quizResults.band.label}" range, so these resources focus on practical strategies and deeper insights for your specific patterns.`,
      recommendations
    };
  }
  
  // Pattern recognition
  if (lowerMessage.includes('pattern') || lowerMessage.includes('notice') || lowerMessage.includes('recognize')) {
    return {
      response: `Here are key patterns to watch for based on your results:\n\n**Daily Life Signals:**\n- Notice moments of discomfort or tension\n- Pay attention to your first reactions in challenging situations\n- Observe how you explain your choices to yourself\n- Watch for times when you feel defensive\n\n**The Pattern Recognition Practice:**\n1. When you notice a signal, pause\n2. Ask: "What pattern is this?"\n3. Get curious rather than judgmental\n4. Note it without trying to fix it immediately\n\nPatterns become choices once you see them clearly.`
    };
  }
  
  // Default response for quiz results
  return {
    response: `I understand you're asking about your ${quizResults.quizTitle} results. Your "${quizResults.band.label}" score suggests specific patterns worth exploring.\n\n**I can help you with:**\n- Understanding what this means for your daily life\n- Creating a practical action plan for this week\n- Finding related content to deepen your insights\n- Recognizing these patterns as they happen\n\nWhat would be most helpful right now?`,
    recommendations: getRelatedContent(quizResults.quizTitle)
  };
}

export function generateSubscriptionResponse(
  message: string,
  userSubscription: UserSubscription
): ChatResponse {
  const lowerMessage = message.toLowerCase();
  const limits = calculateSubscriptionLimits(userSubscription);
  
  // Blog recommendations for subscribers
  if (lowerMessage.includes('blog') || lowerMessage.includes('read') || lowerMessage.includes('article')) {
    const recommendations = getPersonalizedBlogRecommendations(userSubscription);
    return {
      response: `As a **Premium** subscriber, here are personalized blog recommendations:\n\n**Your Premium Articles:** ${limits.premiumArticlesRemaining} of 3 remaining this month\n\n**Why these articles?**\nI've selected these based on your engagement patterns and areas where you've shown interest in growing. Premium articles include advanced insights and research-backed strategies.`,
      recommendations: { blogs: recommendations }
    };
  }
  
  // Quiz recommendations
  if (lowerMessage.includes('quiz') || lowerMessage.includes('assessment') || lowerMessage.includes('test')) {
    const recommendations = getPersonalizedQuizRecommendations(userSubscription);
    return {
      response: `Based on your interests, here are quiz recommendations:\n\n**Your Free Quizzes:** ${limits.freeQuizzesRemaining} of 2 remaining this month (under $50 value)\n\n**Personalized Selection:**\nThese assessments complement your previous results and can help you explore new dimensions of self-awareness. Additional quizzes available at subscriber discount rates.`,
      recommendations: { quizzes: recommendations }
    };
  }
  
  // Learning plan creation
  if (lowerMessage.includes('plan') || lowerMessage.includes('journey') || lowerMessage.includes('growth')) {
    return {
      response: `Let's create a personalized growth plan! As a **Premium** subscriber, I can design a comprehensive learning journey.\n\n**Your 30-Day Self-Discovery Plan:**\n\n**Week 1-2: Foundation Building**\n- Use your 2 free quizzes strategically\n- Read your 3 premium articles for deeper understanding\n- Start daily reflection practice (5 minutes)\n\n**Week 3-4: Pattern Recognition**\n- Take additional quizzes at subscriber discount\n- Focus on identifying personal patterns\n- Implement one small behavioral experiment\n\n**Ongoing: Integration**\n- Monthly check-ins with new assessments\n- Curated reading based on your results\n- Progress tracking and adjustment\n\nWould you like me to recommend specific starting points?`,
      recommendations: {
        quizzes: getPersonalizedQuizRecommendations(userSubscription),
        blogs: getPersonalizedBlogRecommendations(userSubscription)
      }
    };
  }
  
  // Subscription benefits explanation
  if (lowerMessage.includes('benefit') || lowerMessage.includes('subscription') || lowerMessage.includes('premium')) {
    return {
      response: `Your **Premium Subscription ($32/month)** includes:\n\n**Monthly Allowances:**\n🎯 2 free quizzes (under $50 value)\n📚 3 premium articles with advanced insights\n💬 Unlimited AI conversations\n\n**Ongoing Benefits:**\n📊 Personalized content recommendations\n🎯 Custom learning plans\n💰 Subscriber discounts on additional content\n📈 Progress tracking across assessments\n\n**Current Usage:**\n- Free quizzes: ${limits.freeQuizzesUsed}/2 used\n- Premium articles: ${limits.premiumArticlesUsed}/3 used\n\nWhat would you like to explore with your remaining allowances?`
    };
  }
  
  // Default subscription response
  return {
    response: `As a **Premium** subscriber, you have access to enhanced features:\n\n**This Month:**\n🎯 Free quizzes remaining: ${limits.freeQuizzesRemaining}/2\n📚 Premium articles remaining: ${limits.premiumArticlesRemaining}/3\n💬 Unlimited AI conversations\n\n**What would you like to explore?**\n- Get personalized blog recommendations\n- Find your next quiz based on interests\n- Create a growth plan\n- Learn about subscriber discounts`,
    recommendations: {
      quizzes: getPersonalizedQuizRecommendations(userSubscription),
      blogs: getPersonalizedBlogRecommendations(userSubscription)
    }
  };
}

export function generateGeneralResponse(
  message: string,
  userSubscription?: UserSubscription
): ChatResponse {
  const lowerMessage = message.toLowerCase();
  const isSubscribed = userSubscription?.isSubscribed || false;
  
  // Self-discovery guidance
  if (lowerMessage.includes('understand myself') || lowerMessage.includes('self-discovery')) {
    return {
      response: `Self-discovery is about recognizing patterns in how you think, feel, and behave. Here's how to start:\n\n**The MyBeing Approach:**\n1. **Assess**: Take research-backed quizzes to identify patterns\n2. **Reflect**: Understand what the results mean for you\n3. **Experiment**: Try small changes based on insights\n4. **Track**: Notice what shifts over time\n\n**Start Here:**\n- Take the Cognitive Dissonance assessment to understand value-behavior alignment\n- Try the Stress Patterns check-in for immediate practical insights\n\n${!isSubscribed ? '\n**Want deeper insights?** Premium subscribers get 2 free quizzes monthly plus 3 premium articles with unlimited AI conversations.' : ''}`,
      recommendations: {
        quizzes: [
          { slug: 'cognitive-dissonance', title: 'The Mental Tug-of-War', description: 'Understand when your values and actions are out of sync' },
          { slug: 'stress-patterns', title: 'Stress Patterns Check-in', description: 'Identify your stress signals and response patterns' }
        ]
      }
    };
  }
  
  // Quiz recommendations
  if (lowerMessage.includes('quiz') || lowerMessage.includes('assessment') || lowerMessage.includes('should i take')) {
    return {
      response: `Here are our research-backed assessments to help you understand yourself better:\n\n**Most Popular Starting Points:**\n- **Cognitive Dissonance**: Perfect for understanding value-behavior alignment\n- **Stress Patterns**: Great for immediate, practical insights\n- **Self-Awareness Check**: Explores your self-reflection habits\n\n**How to Choose:**\n- Start with what feels most relevant to your current challenges\n- Each quiz takes 5-10 minutes\n- You'll get immediate results with actionable insights\n\n${!isSubscribed ? '\n💡 **Tip**: Premium subscribers get personalized quiz recommendations based on their interests and previous results.' : ''}`,
      recommendations: {
        quizzes: quizzes.slice(0, 3).map(q => ({
          slug: q.slug,
          title: q.title,
          description: q.description
        }))
      }
    };
  }
  
  // Subscription promotion for free users
  if (!isSubscribed && (lowerMessage.includes('premium') || lowerMessage.includes('subscription') || lowerMessage.includes('upgrade'))) {
    return {
      response: `**MyBeing Premium Subscription ($32/month):**\n\n**Monthly Allowances:**\n🎯 2 free quizzes (under $50 value)\n📚 3 premium articles with advanced research\n💬 Unlimited AI conversations\n\n**Ongoing Benefits:**\n📊 Personalized content recommendations\n🎯 Custom learning plans\n💰 Subscriber discounts on additional content\n📈 Progress tracking across assessments\n\n**Why Subscribe?**\nGet personalized guidance tailored to your unique patterns and interests, plus monthly allowances that let you explore deeply without worrying about individual costs.\n\n[Subscribe for $32/month](/pricing)`,
      recommendations: {
        blogs: blogs.filter(b => !b.isPremium).slice(0, 2).map(b => ({
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt
        }))
      }
    };
  }
  
  // Default general response
  return {
    response: `I'm here to help you on your self-discovery journey! I can:\n\n**Free Features:**\n• Help you understand quiz results\n• Recommend assessments based on your interests\n• Explain psychological concepts\n• Provide basic content recommendations\n\n**Popular Starting Points:**\n• "What quizzes should I take?"\n• "Help me understand cognitive patterns"\n• "How does self-discovery work?"\n\n${!isSubscribed ? '\n**Want More?** Premium subscribers ($32/month) get 2 free quizzes + 3 premium articles monthly, plus unlimited conversations and personalized recommendations.' : ''}\n\nWhat would you like to explore?`,
    recommendations: {
      quizzes: quizzes.slice(0, 2).map(q => ({
        slug: q.slug,
        title: q.title,
        description: q.description
      })),
      blogs: blogs.filter(b => !b.isPremium).slice(0, 2).map(b => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt
      }))
    }
  };
}
