import { BaseAIProvider, AIMessage, AIResponse, AIProviderConfig } from './base';

export class OpenAIProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(config: AIProviderConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
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
      throw new Error('Rate limit exceeded for OpenAI provider');
    }

    const startTime = Date.now();

    try {
      const formattedMessages = this.formatMessages(messages, options?.systemPrompt);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4',
          messages: formattedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: options?.temperature ?? this.config.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? this.config.maxTokens ?? 2000,
          top_p: this.config.topP ?? 1,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      return {
        content: data.choices[0]?.message?.content || '',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        model: data.model || this.config.model,
        provider: 'openai',
        responseTime,
        metadata: {
          finishReason: data.choices[0]?.finish_reason,
          requestId: response.headers.get('x-request-id'),
        },
      };
    } catch (error) {
      throw new Error(`OpenAI provider error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
