import { BaseAIProvider, AIMessage, AIResponse, AIProviderConfig } from './providers/base';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';
import { GeminiProvider } from './providers/gemini';

export interface AIManagerConfig {
  providers: AIProviderConfig[];
  fallbackStrategy: 'priority' | 'round-robin' | 'fastest';
  retryAttempts: number;
  timeout: number;
}

export class AIManager {
  private providers: Map<string, BaseAIProvider> = new Map();
  private config: AIManagerConfig;
  private currentProviderIndex = 0;

  constructor(config: AIManagerConfig) {
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders() {
    this.config.providers.forEach(providerConfig => {
      if (!providerConfig.enabled || !providerConfig.apiKey) {
        return;
      }

      let provider: BaseAIProvider;

      switch (providerConfig.name.toLowerCase()) {
        case 'openai':
          provider = new OpenAIProvider(providerConfig);
          break;
        case 'claude':
        case 'anthropic':
          provider = new ClaudeProvider(providerConfig);
          break;
        case 'gemini':
        case 'google':
          provider = new GeminiProvider(providerConfig);
          break;
        default:
          console.warn(`Unknown AI provider: ${providerConfig.name}`);
          return;
      }

      this.providers.set(providerConfig.name, provider);
    });
  }

  async generateResponse(
    messages: AIMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
      preferredProvider?: string;
    }
  ): Promise<AIResponse> {
    const availableProviders = this.getAvailableProviders();
    
    if (availableProviders.length === 0) {
      throw new Error('No AI providers available');
    }

    // If a preferred provider is specified and available, try it first
    if (options?.preferredProvider) {
      const preferredProvider = this.providers.get(options.preferredProvider);
      if (preferredProvider && preferredProvider.isEnabled()) {
        try {
          return await this.executeWithTimeout(
            preferredProvider.generateResponse(messages, options),
            this.config.timeout
          );
        } catch (error) {
          console.warn(`Preferred provider ${options.preferredProvider} failed:`, error);
          // Continue to fallback strategy
        }
      }
    }

    // Use fallback strategy
    const orderedProviders = this.orderProvidersByStrategy(availableProviders);
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      for (const provider of orderedProviders) {
        try {
          const response = await this.executeWithTimeout(
            provider.generateResponse(messages, options),
            this.config.timeout
          );
          
          // Log successful usage
          await this.logUsage(provider.getName(), response);
          
          return response;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.warn(`Provider ${provider.getName()} failed (attempt ${attempt + 1}):`, error);
          
          // Log failed usage
          await this.logFailure(provider.getName(), lastError);
        }
      }
    }

    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
  }

  private getAvailableProviders(): BaseAIProvider[] {
    return Array.from(this.providers.values()).filter(provider => provider.isEnabled());
  }

  private orderProvidersByStrategy(providers: BaseAIProvider[]): BaseAIProvider[] {
    switch (this.config.fallbackStrategy) {
      case 'priority':
        return providers.sort((a, b) => b.getPriority() - a.getPriority());
      
      case 'round-robin':
        const ordered = [...providers];
        // Rotate based on current index
        for (let i = 0; i < this.currentProviderIndex % providers.length; i++) {
          ordered.push(ordered.shift()!);
        }
        this.currentProviderIndex++;
        return ordered;
      
      case 'fastest':
        // For now, use priority. In the future, could track response times
        return providers.sort((a, b) => b.getPriority() - a.getPriority());
      
      default:
        return providers;
    }
  }

  private async executeWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  private async logUsage(providerName: string, response: AIResponse) {
    try {
      // Log to database or analytics service
      console.log(`AI Usage - Provider: ${providerName}, Tokens: ${response.usage?.totalTokens}, Time: ${response.responseTime}ms`);
      
      // In a real implementation, you'd save this to your database
      // await saveAIUsageLog({
      //   provider: providerName,
      //   model: response.model,
      //   tokensUsed: response.usage?.totalTokens || 0,
      //   responseTime: response.responseTime,
      //   timestamp: new Date(),
      //   success: true
      // });
    } catch (error) {
      console.error('Failed to log AI usage:', error);
    }
  }

  private async logFailure(providerName: string, error: Error) {
    try {
      console.error(`AI Failure - Provider: ${providerName}, Error: ${error.message}`);
      
      // In a real implementation, you'd save this to your database
      // await saveAIUsageLog({
      //   provider: providerName,
      //   error: error.message,
      //   timestamp: new Date(),
      //   success: false
      // });
    } catch (logError) {
      console.error('Failed to log AI failure:', logError);
    }
  }

  getProviderStatus(): Record<string, { enabled: boolean; name: string; priority: number }> {
    const status: Record<string, { enabled: boolean; name: string; priority: number }> = {};
    
    this.providers.forEach((provider, name) => {
      status[name] = {
        enabled: provider.isEnabled(),
        name: provider.getName(),
        priority: provider.getPriority()
      };
    });

    return status;
  }

  async healthCheck(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    const testMessage: AIMessage = {
      role: 'user',
      content: 'Hello, this is a health check. Please respond with "OK".',
      timestamp: new Date()
    };

    for (const [name, provider] of this.providers) {
      if (!provider.isEnabled()) {
        health[name] = false;
        continue;
      }

      try {
        await this.executeWithTimeout(
          provider.generateResponse([testMessage], { maxTokens: 10 }),
          5000 // 5 second timeout for health checks
        );
        health[name] = true;
      } catch (error) {
        health[name] = false;
      }
    }

    return health;
  }
}
