import { BaseAIProvider, AIMessage, AIResponse, AIProviderConfig } from './base';

export class ClaudeProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(config: AIProviderConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  }

  async generateResponse(
    messages: AIMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    }
  ): Promise<AIResponse> {
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded for Claude provider');
    }

    const startTime = Date.now();

    try {
      // Claude uses a different message format
      const systemMessage = options?.systemPrompt || 'You are a helpful AI assistant for MyBeing, a self-discovery platform focused on psychology and personal growth.';
      
      // Filter out system messages and format for Claude
      const userMessages = messages.filter(msg => msg.role !== 'system');
      const formattedMessages = userMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-sonnet-20240229',
          messages: formattedMessages,
          system: systemMessage,
          max_tokens: options?.maxTokens ?? this.config.maxTokens ?? 2000,
          temperature: options?.temperature ?? this.config.temperature ?? 0.7,
          top_p: this.config.topP ?? 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      return {
        content: data.content[0]?.text || '',
        usage: {
          promptTokens: data.usage?.input_tokens || 0,
          completionTokens: data.usage?.output_tokens || 0,
          totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        },
        model: data.model || this.config.model,
        provider: 'claude',
        responseTime,
        metadata: {
          stopReason: data.stop_reason,
          requestId: response.headers.get('request-id'),
        },
      };
    } catch (error) {
      throw new Error(`Claude provider error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
