import { AIManager, AIManagerConfig } from './manager';

// AI Provider Configuration
const AI_CONFIG: AIManagerConfig = {
  providers: [
    {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4',
      maxTokens: 2000,
      temperature: 0.7,
      enabled: !!process.env.OPENAI_API_KEY,
      priority: 100,
      rateLimit: {
        requestsPerMinute: 60,
        tokensPerMinute: 100000,
      },
    },
    {
      name: 'claude',
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      maxTokens: 2000,
      temperature: 0.7,
      enabled: !!process.env.ANTHROPIC_API_KEY,
      priority: 90,
      rateLimit: {
        requestsPerMinute: 50,
        tokensPerMinute: 80000,
      },
    },
    {
      name: 'gemini',
      apiKey: process.env.GOOGLE_AI_API_KEY || '',
      model: process.env.GOOGLE_AI_MODEL || 'gemini-1.5-pro',
      maxTokens: 2000,
      temperature: 0.7,
      enabled: !!process.env.GOOGLE_AI_API_KEY,
      priority: 80,
      rateLimit: {
        requestsPerMinute: 60,
        tokensPerMinute: 120000,
      },
    },
  ],
  fallbackStrategy: 'priority',
  retryAttempts: 2,
  timeout: 30000, // 30 seconds
};

// Singleton AI Manager instance
let aiManager: AIManager | null = null;

export function getAIManager(): AIManager {
  if (!aiManager) {
    aiManager = new AIManager(AI_CONFIG);
  }
  return aiManager;
}

// System prompts for different contexts
export const SYSTEM_PROMPTS = {
  quiz_analysis: `You are an expert psychologist and researcher helping users understand their quiz results on MyBeing, a self-discovery platform. 

Your role:
- Analyze quiz results with empathy and scientific accuracy
- Provide insights based on psychological research
- Avoid medical diagnoses or clinical advice
- Focus on patterns, growth opportunities, and self-awareness
- Use encouraging, non-judgmental language
- Reference relevant psychological concepts when helpful

Remember: There are no "right" or "wrong" answers in self-discovery. Every result is valid and offers opportunities for growth.`,

  general_chat: `You are a helpful AI assistant for MyBeing, a self-discovery platform focused on psychology and personal growth.

Your expertise includes:
- Psychology and behavioral science
- Self-awareness and personal development
- Research-backed insights about human behavior
- Pattern recognition in thoughts and behaviors

Guidelines:
- Be empathetic and supportive
- Provide evidence-based insights when possible
- Encourage self-reflection and growth
- Avoid medical or clinical diagnoses
- Focus on empowerment and understanding
- Ask thoughtful follow-up questions`,

  content_creation: `You are an expert content creator and psychologist helping to develop educational content for MyBeing.

Your role:
- Create engaging, research-backed content about psychology and self-discovery
- Develop quiz questions that promote self-reflection
- Write articles that are accessible yet scientifically grounded
- Focus on practical applications of psychological insights
- Maintain a tone that is professional yet approachable

Content should be:
- Evidence-based and scientifically accurate
- Engaging and easy to understand
- Focused on personal growth and self-awareness
- Non-judgmental and inclusive`,
};

// Helper function to get appropriate system prompt
export function getSystemPrompt(context: keyof typeof SYSTEM_PROMPTS): string {
  return SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.general_chat;
}

// AI Configuration for admin panel
export function getAIConfig() {
  return {
    providers: AI_CONFIG.providers.map(p => ({
      name: p.name,
      enabled: p.enabled,
      model: p.model,
      priority: p.priority,
      hasApiKey: !!p.apiKey,
    })),
    fallbackStrategy: AI_CONFIG.fallbackStrategy,
    retryAttempts: AI_CONFIG.retryAttempts,
    timeout: AI_CONFIG.timeout,
  };
}
