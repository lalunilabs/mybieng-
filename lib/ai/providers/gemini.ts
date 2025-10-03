import { BaseAIProvider, AIMessage, AIResponse, AIProviderConfig } from './base';

export class GeminiProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(config: AIProviderConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
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
      throw new Error('Rate limit exceeded for Gemini provider');
    }

    const startTime = Date.now();

    try {
      // Gemini uses a different format - convert messages to parts
      const systemInstruction = options?.systemPrompt || 'You are a helpful AI assistant for MyBeing, a self-discovery platform focused on psychology and personal growth.';
      
      const contents = [];
      
      // Add system instruction as first user message if provided
      if (systemInstruction) {
        contents.push({
          role: 'user',
          parts: [{ text: systemInstruction }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'I understand. I\'m ready to help with psychology and self-discovery topics.' }]
        });
      }

      // Convert messages to Gemini format
      messages.forEach(msg => {
        if (msg.role !== 'system') {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          });
        }
      });

      const model = this.config.model || 'gemini-1.5-pro';
      const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: options?.temperature ?? this.config.temperature ?? 0.7,
            maxOutputTokens: options?.maxTokens ?? this.config.maxTokens ?? 2000,
            topP: this.config.topP ?? 1,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      const candidate = data.candidates?.[0];
      if (!candidate || !candidate.content) {
        throw new Error('No valid response from Gemini');
      }

      return {
        content: candidate.content.parts[0]?.text || '',
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0,
        },
        model: model,
        provider: 'gemini',
        responseTime,
        metadata: {
          finishReason: candidate.finishReason,
          safetyRatings: candidate.safetyRatings,
        },
      };
    } catch (error) {
      throw new Error(`Gemini provider error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
