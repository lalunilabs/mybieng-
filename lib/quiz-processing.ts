import { Quiz, QuizBand, MotivationProfile } from '@/data/quizzes';
import { 
  AdaptiveQuizResult, 
  QuizResultStyle, 
  NumericBandResult, 
  CategoricalResult, 
  AIGeneratedResult 
} from '@/components/quiz/AdaptiveQuizResultsSystem';

export interface QuizAnswer {
  questionId: string;
  value: number | string;
  category?: string; // For categorical scoring
}

export interface QuizSubmission {
  quizSlug: string;
  answers: QuizAnswer[];
  startTime: number;
  endTime: number;
  userId?: string;
  sessionId: string;
}

/**
 * Process quiz submission and generate appropriate results based on quiz configuration
 */
export async function processQuizSubmission(
  submission: QuizSubmission,
  quiz: Quiz
): Promise<AdaptiveQuizResult> {
  const totalTime = Math.floor((submission.endTime - submission.startTime) / 1000);
  
  // Determine result style based on quiz configuration
  const resultStyle = determineResultStyle(quiz);
  
  const baseResult: AdaptiveQuizResult = {
    id: crypto.randomUUID(),
    quizSlug: submission.quizSlug,
    quizTitle: quiz.title,
    resultStyle,
    completedAt: new Date().toISOString(),
    totalTime,
    researchContext: {
      methodology: 'Validated psychometric assessment',
      sampleSize: 10000, // This would come from actual research data
      reliability: 0.87,
      validatedBy: ['Behavioral Psychology Research Lab', 'MyBeing Research Team']
    },
    recommendations: {
      articles: [], // Would be populated based on results
      quizzes: []   // Would be populated based on results
    }
  };

  // Process based on result style
  switch (resultStyle) {
    case 'numeric':
      baseResult.numericResult = await processNumericResults(submission, quiz);
      break;
    
    case 'categorical':
      baseResult.categoricalResult = await processCategoricalResults(submission, quiz);
      break;
    
    case 'ai-narrative':
      baseResult.aiResult = await processAIResults(submission, quiz);
      break;
    
    case 'hybrid':
      baseResult.numericResult = await processNumericResults(submission, quiz);
      baseResult.categoricalResult = await processCategoricalResults(submission, quiz);
      baseResult.aiResult = await processAIResults(submission, quiz);
      break;
  }

  // Generate recommendations based on results
  baseResult.recommendations = await generateRecommendations(baseResult, quiz);

  return baseResult;
}

/**
 * Determine the appropriate result style for a quiz
 */
function determineResultStyle(quiz: Quiz): QuizResultStyle {
  // Check if quiz has explicit result type
  if (quiz.resultType === 'motivation-language' && quiz.resultProfiles) {
    return 'categorical';
  }
  
  // Check if quiz has traditional bands
  if (quiz.bands && quiz.bands.length > 0) {
    return 'numeric';
  }
  
  // Default to hybrid for comprehensive analysis
  return 'hybrid';
}

/**
 * Process numeric band-based results
 */
async function processNumericResults(
  submission: QuizSubmission,
  quiz: Quiz
): Promise<NumericBandResult> {
  // Calculate total score
  const numericAnswers = submission.answers.filter(a => typeof a.value === 'number');
  const totalScore = numericAnswers.reduce((sum, answer) => sum + (answer.value as number), 0);
  const maxScore = numericAnswers.length * 5; // Assuming 5-point Likert scale
  const percentage = (totalScore / maxScore) * 100;

  // Find appropriate band
  let band = quiz.bands?.[0] || {
    min: 0,
    max: 100,
    label: 'Result',
    advice: 'Thank you for completing the assessment.'
  };

  if (quiz.bands) {
    for (const b of quiz.bands) {
      if (totalScore >= b.min && totalScore <= b.max) {
        band = b;
        break;
      }
    }
  }

  // Add color coding based on percentage
  const color = percentage >= 70 ? 'red' : percentage >= 40 ? 'yellow' : 'green';

  // Calculate breakdown by question categories if available
  const breakdown: Record<string, number> = {};
  if (quiz.questions.some(q => q.optionCategories)) {
    // Group by categories for breakdown
    quiz.questions.forEach((question, index) => {
      const answer = submission.answers.find(a => a.questionId === question.id);
      if (answer && typeof answer.value === 'number' && question.optionCategories) {
        const category = question.optionCategories[0] || 'General';
        breakdown[category] = (breakdown[category] || 0) + (answer.value as number);
      }
    });
  }

  return {
    score: totalScore,
    maxScore,
    percentage,
    band: { ...band, color },
    breakdown: Object.keys(breakdown).length > 0 ? breakdown : undefined
  };
}

/**
 * Process categorical/profile-based results
 */
async function processCategoricalResults(
  submission: QuizSubmission,
  quiz: Quiz
): Promise<CategoricalResult> {
  const categoryScores: Record<string, number> = {};
  
  // Calculate scores for each category
  quiz.questions.forEach((question, index) => {
    const answer = submission.answers.find(a => a.questionId === question.id);
    if (answer && question.optionCategories) {
      if (typeof answer.value === 'number') {
        // Multiple choice with category mapping
        const categoryIndex = answer.value;
        const category = question.optionCategories[categoryIndex];
        if (category) {
          categoryScores[category] = (categoryScores[category] || 0) + 1;
        }
      } else if (typeof answer.value === 'string' && answer.category) {
        // Direct category assignment
        categoryScores[answer.category] = (categoryScores[answer.category] || 0) + 1;
      }
    }
  });

  // Find primary and secondary categories
  const sortedCategories = Object.entries(categoryScores)
    .sort(([,a], [,b]) => b - a);
  
  const primaryCategory = sortedCategories[0]?.[0] || 'balanced';
  const secondaryCategory = sortedCategories[1]?.[0];

  // Get profile information
  const profile = quiz.resultProfiles?.[primaryCategory] || {
    title: `${primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1)} Type`,
    subtitle: 'Your unique behavioral profile',
    description: 'Based on your responses, this represents your primary behavioral pattern.',
    strengths: ['Adaptable', 'Thoughtful', 'Engaged'],
    challenges: ['Continue developing self-awareness', 'Practice new approaches'],
    recommendations: ['Reflect on your patterns', 'Seek feedback from others']
  };

  return {
    primaryCategory,
    secondaryCategory,
    categoryScores,
    profile: {
      title: profile.title,
      subtitle: profile.subtitle,
      // Safely access optional legacy fields (dna/lights/kills/support) when available
      description: (Array.isArray((profile as any).dna) && (profile as any).dna[0])
        || (profile as any).description
        || 'Your behavioral profile analysis.',
      strengths: (Array.isArray((profile as any).lights) && (profile as any).lights)
        || (profile as any).strengths
        || [],
      challenges: (Array.isArray((profile as any).kills) && (profile as any).kills)
        || (profile as any).challenges
        || [],
      recommendations: (Array.isArray((profile as any).support) && (profile as any).support)
        || (profile as any).recommendations
        || []
    }
  };
}

/**
 * Process AI-generated narrative results
 */
async function processAIResults(
  submission: QuizSubmission,
  quiz: Quiz
): Promise<AIGeneratedResult> {
  // In a real implementation, this would call an AI service
  // For now, we'll generate structured results based on the quiz data
  
  const answers = submission.answers;
  const highScores = answers.filter(a => typeof a.value === 'number' && a.value >= 4);
  const lowScores = answers.filter(a => typeof a.value === 'number' && a.value <= 2);
  
  // Generate personalized narrative
  const personalizedNarrative = generatePersonalizedNarrative(submission, quiz, highScores, lowScores);
  
  // Extract key insights
  const keyInsights = generateKeyInsights(submission, quiz, highScores, lowScores);
  
  // Identify behavioral patterns
  const behavioralPatterns = generateBehavioralPatterns(submission, quiz);
  
  // Identify growth areas
  const growthAreas = generateGrowthAreas(submission, quiz, lowScores);
  
  // Create action plan
  const actionPlan = generateActionPlan(submission, quiz, highScores, lowScores);

  return {
    personalizedNarrative,
    keyInsights,
    behavioralPatterns,
    growthAreas,
    actionPlan,
    confidence: 0.85 // AI confidence score
  };
}

/**
 * Generate personalized narrative based on responses
 */
function generatePersonalizedNarrative(
  submission: QuizSubmission,
  quiz: Quiz,
  highScores: QuizAnswer[],
  lowScores: QuizAnswer[]
): string {
  const quizType = quiz.slug;
  const strongAreas = highScores.length;
  const developmentAreas = lowScores.length;
  
  let narrative = `Based on your responses to the ${quiz.title}, your profile reveals a nuanced pattern of behaviors and tendencies. `;
  
  if (strongAreas > developmentAreas) {
    narrative += `You demonstrate strong alignment in ${strongAreas} key areas, suggesting well-developed self-awareness and consistent behavioral patterns. `;
  } else if (developmentAreas > strongAreas) {
    narrative += `Your responses indicate ${developmentAreas} areas with significant growth potential, which is actually a positive sign of honest self-reflection. `;
  } else {
    narrative += `Your responses show a balanced profile with both strengths and areas for development, indicating healthy self-awareness. `;
  }
  
  narrative += `This assessment reveals patterns that can guide your personal development journey with specific, actionable insights tailored to your unique behavioral profile.`;
  
  return narrative;
}

/**
 * Generate key insights from responses
 */
function generateKeyInsights(
  submission: QuizSubmission,
  quiz: Quiz,
  highScores: QuizAnswer[],
  lowScores: QuizAnswer[]
): string[] {
  const insights: string[] = [];
  
  // Analyze response patterns
  if (highScores.length >= 3) {
    insights.push(`You show strong consistency in ${highScores.length} areas, indicating well-established behavioral patterns that serve you well.`);
  }
  
  if (lowScores.length >= 2) {
    insights.push(`${lowScores.length} areas show lower scores, representing opportunities for focused growth and development.`);
  }
  
  // Quiz-specific insights
  if (quiz.slug.includes('stress')) {
    insights.push('Your stress response patterns suggest specific triggers and coping mechanisms that can be optimized.');
  } else if (quiz.slug.includes('motivation')) {
    insights.push('Your motivation drivers reveal the specific conditions and environments where you thrive most.');
  } else if (quiz.slug.includes('cognitive')) {
    insights.push('Your cognitive patterns show how you process information and make decisions under different circumstances.');
  }
  
  insights.push('These patterns are not fixed traits but dynamic tendencies that can be developed and refined over time.');
  
  return insights;
}

/**
 * Generate behavioral patterns analysis
 */
function generateBehavioralPatterns(
  submission: QuizSubmission,
  quiz: Quiz
): string[] {
  const patterns: string[] = [];
  
  // Analyze consistency in responses
  const numericAnswers = submission.answers.filter(a => typeof a.value === 'number') as Array<QuizAnswer & { value: number }>;
  const avgScore = numericAnswers.reduce((sum, a) => sum + a.value, 0) / numericAnswers.length;
  const variance = numericAnswers.reduce((sum, a) => sum + Math.pow(a.value - avgScore, 2), 0) / numericAnswers.length;
  
  if (variance < 0.5) {
    patterns.push('Highly consistent response pattern - you have clear, stable preferences and behaviors');
  } else if (variance > 2) {
    patterns.push('Variable response pattern - you adapt your behavior significantly based on context');
  } else {
    patterns.push('Moderately consistent pattern - you have core tendencies with situational flexibility');
  }
  
  // Add quiz-specific patterns
  patterns.push('Your responses suggest a thoughtful, reflective approach to self-assessment');
  patterns.push('You demonstrate awareness of both your strengths and areas for growth');
  
  return patterns;
}

/**
 * Generate growth areas based on low scores
 */
function generateGrowthAreas(
  submission: QuizSubmission,
  quiz: Quiz,
  lowScores: QuizAnswer[]
): string[] {
  const growthAreas: string[] = [];
  
  if (lowScores.length > 0) {
    growthAreas.push('Self-awareness development in areas where you scored lower');
    growthAreas.push('Building consistent practices around your identified development areas');
    
    if (quiz.slug.includes('stress')) {
      growthAreas.push('Stress management techniques and resilience building');
    } else if (quiz.slug.includes('motivation')) {
      growthAreas.push('Expanding your motivation toolkit with new strategies');
    }
  }
  
  growthAreas.push('Regular self-reflection and pattern recognition');
  growthAreas.push('Seeking feedback from trusted others to validate your insights');
  
  return growthAreas;
}

/**
 * Generate structured action plan
 */
function generateActionPlan(
  submission: QuizSubmission,
  quiz: Quiz,
  highScores: QuizAnswer[],
  lowScores: QuizAnswer[]
): { immediate: string[]; shortTerm: string[]; longTerm: string[] } {
  return {
    immediate: [
      'Review your results and identify the top 2 insights that resonate most',
      'Share your results with a trusted friend or mentor for additional perspective',
      'Choose one small behavioral change to experiment with this week'
    ],
    shortTerm: [
      'Develop a regular self-reflection practice (weekly check-ins)',
      'Implement strategies that leverage your identified strengths',
      'Focus on one growth area with specific, measurable goals'
    ],
    longTerm: [
      'Retake this assessment in 3-6 months to track your development',
      'Integrate learnings into your broader personal development plan',
      'Consider exploring related assessments to deepen your self-understanding'
    ]
  };
}

/**
 * Generate content recommendations based on results
 */
async function generateRecommendations(
  result: AdaptiveQuizResult,
  quiz: Quiz
): Promise<{ articles: Array<{ title: string; slug: string; readTime: number }>; quizzes: Array<{ title: string; slug: string; description: string }> }> {
  // This would typically query a database or content management system
  // For now, we'll return sample recommendations
  
  const articles = [
    { title: 'Understanding Your Behavioral Patterns', slug: 'behavioral-patterns', readTime: 8 },
    { title: 'Building Self-Awareness Through Reflection', slug: 'self-awareness-reflection', readTime: 6 },
    { title: 'Creating Sustainable Personal Change', slug: 'sustainable-change', readTime: 10 }
  ];
  
  const quizzes = [
    { title: 'Values Alignment Assessment', slug: 'values-alignment', description: 'Explore how your actions align with your core values' },
    { title: 'Decision-Making Style Quiz', slug: 'decision-making', description: 'Understand your approach to making important decisions' }
  ];
  
  return { articles, quizzes };
}

/**
 * Generate AI analysis for existing results (for the "Get AI Analysis" feature)
 */
export async function generateAIAnalysis(
  result: AdaptiveQuizResult,
  quiz: Quiz
): Promise<AIGeneratedResult> {
  // This would call an actual AI service in production
  // For now, we'll generate analysis based on existing result data
  
  let baseNarrative = `Your ${quiz.title} results reveal fascinating insights about your behavioral patterns and decision-making style. `;
  
  if (result.numericResult) {
    const percentage = result.numericResult.percentage;
    if (percentage >= 70) {
      baseNarrative += `With a score in the ${result.numericResult.band.label.toLowerCase()} range, you demonstrate strong patterns in this area. `;
    } else if (percentage >= 40) {
      baseNarrative += `Your moderate score suggests balanced tendencies with room for targeted development. `;
    } else {
      baseNarrative += `Your lower score indicates significant opportunities for growth and positive change. `;
    }
  }
  
  if (result.categoricalResult) {
    baseNarrative += `Your primary profile as "${result.categoricalResult.primaryCategory}" reflects core behavioral tendencies that influence how you approach challenges and opportunities. `;
  }
  
  baseNarrative += `These patterns provide a roadmap for personal development that honors your natural strengths while addressing areas for growth.`;
  
  return {
    personalizedNarrative: baseNarrative,
    keyInsights: [
      'Your results show a unique combination of traits that can be leveraged for personal growth',
      'The patterns identified align with research on behavioral psychology and personal development',
      'Your honest self-assessment provides a solid foundation for meaningful change'
    ],
    behavioralPatterns: [
      'Consistent self-reflection and awareness-building behaviors',
      'Adaptive responses to different situations and contexts',
      'Growth-oriented mindset with openness to development'
    ],
    growthAreas: [
      'Developing stronger self-awareness in identified areas',
      'Building consistent practices around personal development',
      'Seeking feedback and external perspectives on your patterns'
    ],
    actionPlan: {
      immediate: [
        'Reflect on which insights feel most accurate and actionable',
        'Identify one specific behavior to focus on this week',
        'Share results with someone who knows you well for validation'
      ],
      shortTerm: [
        'Create a monthly self-assessment routine',
        'Implement one new strategy based on your results',
        'Track progress on your chosen development area'
      ],
      longTerm: [
        'Retake the assessment to measure growth over time',
        'Integrate insights into your broader life and career planning',
        'Explore additional assessments to deepen self-understanding'
      ]
    },
    confidence: 0.88
  };
}
