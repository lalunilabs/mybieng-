import { loadQuizBySlug as getQuizDef } from '@/lib/content';
// AI Integration for Quiz Analysis and Insights
// This would integrate with OpenAI, Claude, or your preferred AI service

export interface QuizResponse {
  questionId: string;
  questionText: string;
  answer: string | number;
  // Accept both legacy and new UI types
  questionType: 'multiple-choice' | 'scale' | 'text' | 'likert' | 'yes_no' | 'multiple_choice' | 'text_input';
}

export interface AIInsight {
  pattern: string;
  description: string;
  actionableAdvice: string;
  relatedContent?: string[];
}

export interface QuizAnalysis {
  score: number;
  band: string;
  bandDescription: string;
  keyInsights: AIInsight[];
  personalizedMessage: string;
  recommendedActions: string[];
  nextSteps: string[];
}

// AI analysis with real OpenAI integration
export async function analyzeQuizResponses(
  quizSlug: string,
  responses: QuizResponse[]
): Promise<QuizAnalysis> {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (openaiKey) {
    try {
      return await analyzeWithOpenAI(quizSlug, responses);
    } catch (error) {
      console.error('OpenAI analysis failed, falling back to local analysis:', error);
    }
  }
  
  // Prefer quiz metadata when available
  try {
    const def = getQuizDef(quizSlug);
    if (def?.resultType === 'motivation-language' || quizSlug === 'motivation-language') {
      return analyzeMotivationLanguageQuiz(quizSlug, responses);
    }
  } catch {}

  // Fallback to local analysis by slug
  if (quizSlug === 'cognitive-dissonance') {
    return analyzeCognitiveDissonanceQuiz(responses);
  } else if (quizSlug === 'stress-patterns') {
    return analyzeStressPatternsQuiz(responses);
  }
  
  return generateGenericAnalysis(responses);
}

async function analyzeWithOpenAI(
  quizSlug: string,
  responses: QuizResponse[]
): Promise<QuizAnalysis> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4';
  
  const prompt = `You are a psychology expert analyzing quiz responses for the MyBeing self-discovery platform. 

Quiz: ${quizSlug}
User Responses: ${JSON.stringify(responses, null, 2)}

Analyze these responses and provide insights focused on:
1. Pattern recognition (no right/wrong answers)
2. Behavioral tendencies and self-awareness gaps
3. Actionable advice for personal growth
4. Research-backed recommendations

Return a JSON object with this structure:
{
  "score": number (0-100),
  "band": "descriptive category",
  "bandDescription": "brief explanation",
  "keyInsights": [
    {
      "pattern": "insight category",
      "description": "what the data shows",
      "actionableAdvice": "specific action they can take"
    }
  ],
  "personalizedMessage": "encouraging, personalized message",
  "recommendedActions": ["specific action 1", "specific action 2"],
  "nextSteps": ["next step 1", "next step 2"]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a psychology expert providing non-judgmental, research-backed insights for self-discovery. Focus on patterns and growth opportunities, not deficits.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0]?.message?.content;
  
  if (!aiResponse) {
    throw new Error('No response from OpenAI');
  }

  try {
    return JSON.parse(aiResponse);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', parseError);
    throw new Error('Invalid AI response format');
  }
}

function analyzeCognitiveDissonanceQuiz(responses: QuizResponse[]): QuizAnalysis {
  // Treat any numeric answers as contributing to score (supports 'scale'/'likert')
  const numericResponses = responses.filter(r => typeof r.answer === 'number');
  const totalScore = numericResponses.reduce((sum, r) => sum + (r.answer as number), 0);
  const maxScore = numericResponses.length * 5 || 100;
  const normalizedScore = Math.round((totalScore / maxScore) * 100);
  
  let band = 'Low Dissonance';
  let bandDescription = 'You tend to maintain consistency between values and actions.';
  
  if (normalizedScore > 40) {
    band = 'Moderate Dissonance';
    bandDescription = 'Some tension exists between your beliefs and behaviors.';
  }
  if (normalizedScore > 70) {
    band = 'High Dissonance';
    bandDescription = 'Frequent conflicts between values and actions may be causing stress.';
  }
  
  const insights: AIInsight[] = [
    {
      pattern: 'Justification Patterns',
      description: 'Based on your responses, you show moderate tendency to rationalize decisions that conflict with your values.',
      actionableAdvice: 'Practice the "pause and reflect" technique: when you notice yourself making quick justifications, take a moment to examine the underlying value conflict.',
      relatedContent: ['mental-tug-of-war-cognitive-dissonance']
    },
    {
      pattern: 'Value-Action Alignment',
      description: 'Your responses suggest some areas where your actions and values may not be fully aligned.',
      actionableAdvice: 'Identify your top 3 core values and track for one week how often your daily decisions align with these values.',
      relatedContent: ['tracking-stress-patterns']
    }
  ];
  
  return {
    score: normalizedScore,
    band,
    bandDescription,
    keyInsights: insights,
    personalizedMessage: `Your cognitive dissonance score of ${normalizedScore} suggests ${bandDescription.toLowerCase()} This is completely normal - we all experience some tension between our ideals and reality. The key is developing awareness of these patterns so you can make more intentional choices.`,
    recommendedActions: [
      'Keep a brief daily log of moments when you felt torn between what you wanted to do and what you thought you should do',
      'Practice the "values check" - before major decisions, ask yourself which of your core values this choice supports',
      'Experiment with one small behavior change that better aligns with your stated values'
    ],
    nextSteps: [
      'Take the Stress Patterns quiz to understand how this tension might be affecting your well-being',
      'Read our blog post on cognitive dissonance patterns',
      'Consider setting up weekly reflection time to process value-action conflicts'
    ]
  };
}

function analyzeStressPatternsQuiz(responses: QuizResponse[]): QuizAnalysis {
  const numericResponses = responses.filter(r => typeof r.answer === 'number');
  const totalScore = numericResponses.reduce((sum, r) => sum + (r.answer as number), 0);
  const maxScore = numericResponses.length * 5 || 100;
  const normalizedScore = Math.round((totalScore / maxScore) * 100);
  
  let band = 'Low Stress';
  let bandDescription = 'Your stress levels appear manageable.';
  
  if (normalizedScore > 50) {
    band = 'Moderate Stress';
    bandDescription = 'Some stress patterns worth monitoring.';
  }
  if (normalizedScore > 75) {
    band = 'High Stress';
    bandDescription = 'Consider stress management strategies.';
  }
  
  const insights: AIInsight[] = [
    {
      pattern: 'Sleep Quality Impact',
      description: 'Your sleep quality responses indicate this may be a key factor in your stress patterns.',
      actionableAdvice: 'Focus on sleep hygiene: consistent bedtime, no screens 1 hour before sleep, and a cool, dark environment.',
      relatedContent: ['tracking-stress-patterns']
    }
  ];
  
  return {
    score: normalizedScore,
    band,
    bandDescription,
    keyInsights: insights,
    personalizedMessage: `Your stress assessment reveals ${bandDescription.toLowerCase()} Remember, stress is information - it tells us about what matters to us and where we might need to make adjustments.`,
    recommendedActions: [
      'Track your stress triggers for one week using a simple 1-5 scale',
      'Identify your most effective stress relief activities and schedule them proactively',
      'Practice one micro-recovery technique (deep breathing, brief walk, etc.) daily'
    ],
    nextSteps: [
      'Consider taking the Cognitive Dissonance quiz to explore any value conflicts contributing to stress',
      'Read our stress management research articles',
      'Set up a weekly stress pattern review'
    ]
  };
}

function generateGenericAnalysis(responses: QuizResponse[]): QuizAnalysis {
  const numericResponses = responses.filter(r => typeof r.answer === 'number');
  const totalScore = numericResponses.reduce((sum, r) => sum + (r.answer as number), 0);
  const maxScore = numericResponses.length * 5 || 100;
  const normalizedScore = Math.round((totalScore / maxScore) * 100);
  
  return {
    score: normalizedScore,
    band: 'Assessment Complete',
    bandDescription: 'Your responses have been analyzed for patterns and insights.',
    keyInsights: [
      {
        pattern: 'Response Patterns',
        description: 'Your responses show thoughtful consideration of the questions.',
        actionableAdvice: 'Continue reflecting on these areas for personal growth.',
        relatedContent: []
      }
    ],
    personalizedMessage: 'Thank you for taking the time to reflect on these important questions. Self-awareness is the first step toward positive change.',
    recommendedActions: [
      'Reflect on your responses and identify one area for growth',
      'Consider how these insights apply to your daily life',
      'Share your insights with someone you trust'
    ],
    nextSteps: [
      'Explore our other assessments for additional insights',
      'Read related blog posts for deeper understanding',
      'Consider retaking this assessment in a few weeks to track changes'
    ]
  };
}

// Generate AI-powered chat responses for quiz results
export async function generateChatResponse(
  userMessage: string,
  quizAnalysis: QuizAnalysis,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (openaiKey) {
    try {
      return await generateOpenAIChatResponse(userMessage, quizAnalysis, conversationHistory);
    } catch (error) {
      console.error('OpenAI chat failed, falling back to local responses:', error);
    }
  }
  
  // Fallback to local contextual responses
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('score') || lowerMessage.includes('result')) {
    return `Your score of ${quizAnalysis.score} places you in the "${quizAnalysis.band}" range. ${quizAnalysis.bandDescription} This means ${quizAnalysis.personalizedMessage}`;
  }
  
  if (lowerMessage.includes('what') && lowerMessage.includes('do')) {
    return `Based on your results, here are some specific actions you can take:\n\n${quizAnalysis.recommendedActions.map(action => `• ${action}`).join('\n')}\n\nWould you like me to elaborate on any of these suggestions?`;
  }
  
  if (lowerMessage.includes('pattern') || lowerMessage.includes('insight')) {
    const insights = quizAnalysis.keyInsights.map(insight => 
      `**${insight.pattern}**: ${insight.description} ${insight.actionableAdvice}`
    ).join('\n\n');
    return `Here are the key patterns I identified in your responses:\n\n${insights}`;
  }
  
  if (lowerMessage.includes('next') || lowerMessage.includes('step')) {
    return `Here are your recommended next steps:\n\n${quizAnalysis.nextSteps.map(step => `• ${step}`).join('\n')}\n\nWhich of these resonates most with you?`;
  }
  
  // Generic helpful response
  return `I'm here to help you understand your quiz results better. You can ask me about:\n\n• Your score and what it means\n• Specific patterns in your responses\n• Actionable steps you can take\n• How to apply these insights to your daily life\n\nWhat would you like to explore?`;
}

async function generateOpenAIChatResponse(
  userMessage: string,
  quizAnalysis: QuizAnalysis,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4';
  
  const systemPrompt = `You are a supportive psychology expert helping someone understand their quiz results from MyBeing, a self-discovery platform. 

Their quiz analysis:
- Score: ${quizAnalysis.score}
- Category: ${quizAnalysis.band}
- Description: ${quizAnalysis.bandDescription}
- Key Insights: ${JSON.stringify(quizAnalysis.keyInsights)}
- Recommended Actions: ${JSON.stringify(quizAnalysis.recommendedActions)}
- Next Steps: ${JSON.stringify(quizAnalysis.nextSteps)}

Guidelines:
- Be encouraging and non-judgmental
- Focus on growth and self-awareness
- Provide specific, actionable advice
- Reference their specific results when relevant
- Keep responses conversational and supportive
- No medical advice - focus on behavioral patterns and personal growth`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.8,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try asking your question again.';
}

// Categorical/profile-based analysis for quizzes like 'motivation-language'
function analyzeMotivationLanguageQuiz(quizSlug: string, responses: QuizResponse[]): QuizAnalysis {
  const def = getQuizDef(quizSlug);
  // Guard: if missing definitions, fall back
  if (!def) {
    return generateGenericAnalysis(responses);
  }

  // Build category score map based on question optionCategories mapping
  const categoryScores: Record<string, number> = {};
  const multipleChoiceIds = new Set(
    (def.questions || [])
      .filter((q: any) => q.type === 'multiple_choice' && Array.isArray(q.options) && Array.isArray(q.optionCategories))
      .map((q: any) => q.id)
  );

  for (const r of responses) {
    // Only process multiple-choice style for categorical scoring
    if (!multipleChoiceIds.has(r.questionId)) continue;
    const q = (def.questions || []).find((q: any) => q.id === r.questionId);
    if (!q) continue;
    const options: string[] = q.options || [];
    const cats: string[] = q.optionCategories || [];

    // The answer may be the option text or an index; normalize
    let idx = -1;
    if (typeof r.answer === 'number') {
      idx = Math.max(0, Math.min(options.length - 1, r.answer as number));
    } else if (typeof r.answer === 'string') {
      idx = options.findIndex(o => o === r.answer);
    }
    if (idx < 0 || idx >= cats.length) continue;
    const cat = cats[idx];
    if (!cat) continue;
    categoryScores[cat] = (categoryScores[cat] || 0) + 1;
  }

  // Determine ranking
  const ranked = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  const [topCat, topScore] = ranked[0] || ['profile', 0];
  const [secondCat, secondScore] = ranked[1] || [null, 0];

  // Derive interpretation mode
  let interpretation: 'single' | 'dual' | 'multi' = 'single';
  if (topScore === 0) {
    interpretation = 'multi';
  } else if (secondCat && Math.abs((topScore || 0) - (secondScore || 0)) <= 1) {
    interpretation = 'dual';
  }

  // Prepare messaging based on quiz definition
  const profiles = def.resultProfiles || {} as Record<string, any>;
  const interp = def.resultInterpretation || {} as Record<string, string>;
  const primary = profiles[topCat || ''] || null;
  const secondary = secondCat ? profiles[secondCat] : null;

  const band = primary?.title || (topCat ? topCat.toUpperCase() : 'Profile');
  const bandDescription = interp[interpretation] || 'Your results indicate a meaningful pattern in your motivation profile.';

  // Score as normalized dominance of top category
  const totalCatAnswers = ranked.reduce((s, [, v]) => s + v, 0) || 1;
  const normalizedScore = Math.round((topScore / totalCatAnswers) * 100);

  const keyInsights = [
    primary ? {
      pattern: primary.title,
      description: primary.subtitle || 'Dominant tendency identified.',
      actionableAdvice: (primary.lights?.[0] || primary.support?.[0] || 'Design your environment to align with this motivation style.')
    } : {
      pattern: 'Dominant pattern',
      description: 'A primary tendency was identified in your responses.',
      actionableAdvice: 'Lean into environments that support this pattern.'
    }
  ];

  if (secondary) {
    keyInsights.push({
      pattern: secondary.title,
      description: secondary.subtitle || 'Secondary tendency present.',
      actionableAdvice: (secondary.lights?.[0] || secondary.support?.[0] || 'Blend this style when helpful for specific goals.')
    } as any);
  }

  const recommendedActions: string[] = [];
  if (primary?.lights?.length) recommendedActions.push(`Lean on: ${primary.lights[0]}`);
  if (primary?.support?.length) recommendedActions.push(`Support: ${primary.support[0]}`);
  if (secondary?.lights?.length) recommendedActions.push(`Blend with: ${secondary.lights[0]}`);

  const nextSteps: string[] = [];
  if (primary?.dna?.length) nextSteps.push(`Anchor to: ${primary.dna[0]}`);
  if (secondary?.dna?.length) nextSteps.push(`Also consider: ${secondary.dna[0]}`);

  return {
    score: normalizedScore,
    band,
    bandDescription,
    keyInsights,
    personalizedMessage: bandDescription,
    recommendedActions: recommendedActions.length ? recommendedActions : ['Design your routines to fit your dominant motivation style.'],
    nextSteps: nextSteps.length ? nextSteps : ['Revisit this profile in a few weeks and see what changed.']
  };
}
