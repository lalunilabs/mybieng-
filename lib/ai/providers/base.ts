export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
  responseTime: number;
  metadata?: Record<string, any>;
}

export interface AIProviderConfig {
  name: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  enabled: boolean;
  priority: number;
  rateLimit?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export abstract class BaseAIProvider {
  protected config: AIProviderConfig;
  protected requestCount: number = 0;
  protected lastResetTime: number = Date.now();

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract generateResponse(
    messages: AIMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    }
  ): Promise<AIResponse>;

  protected checkRateLimit(): boolean {
    const now = Date.now();
    const timeSinceReset = now - this.lastResetTime;
    
    // Reset counter every minute
    if (timeSinceReset >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    if (this.config.rateLimit && this.requestCount >= this.config.rateLimit.requestsPerMinute) {
      return false;
    }

    this.requestCount++;
    return true;
  }

  protected formatMessages(messages: AIMessage[], systemPrompt?: string): any[] {
    const formattedMessages = [...messages];
    
    if (systemPrompt) {
      formattedMessages.unshift({
        role: 'system',
        content: systemPrompt,
        timestamp: new Date()
      });
    }

    return formattedMessages;
  }

  isEnabled(): boolean {
    return this.config.enabled && !!this.config.apiKey;
  }

  getName(): string {
    return this.config.name;
  }

  getPriority(): number {
    return this.config.priority;
  }
}
