/**
 * Enum for supported AI providers
 */
export enum ProviderType {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  OLLAMA = 'ollama',
}

/**
 * Interface for provider configuration
 */
export interface IProviderConfig {
  type: ProviderType;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  timeout?: number;
  retries?: number;
  metadata?: Record<string, any>;
}

/**
 * Interface for OpenAI specific configuration
 */
export interface IOpenAIConfig extends IProviderConfig {
  type: ProviderType.OPENAI;
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo' | 'gpt-4o' | 'gpt-4o-mini';
  organization?: string;
  project?: string;
}

/**
 * Interface for Gemini specific configuration
 */
export interface IGeminiConfig extends IProviderConfig {
  type: ProviderType.GEMINI;
  model: 'gemini-pro' | 'gemini-pro-vision' | 'gemini-1.5-pro' | 'gemini-1.5-flash';
  safetySettings?: IGeminiSafetySettings[];
}

/**
 * Interface for Gemini safety settings
 */
export interface IGeminiSafetySettings {
  category: string;
  threshold: string;
}

/**
 * Interface for Ollama specific configuration
 */
export interface IOllamaConfig extends IProviderConfig {
  type: ProviderType.OLLAMA;
  model: string; // Any model available in Ollama
  baseUrl: string; // Required for Ollama
  keepAlive?: string;
  numCtx?: number;
  numGpu?: number;
  numThread?: number;
}

/**
 * Union type for all provider configurations
 */
export type ProviderConfig = IOpenAIConfig | IGeminiConfig | IOllamaConfig;

/**
 * Interface for provider capabilities
 */
export interface IProviderCapabilities {
  supportsStreaming: boolean;
  supportsToolCalling: boolean;
  supportsVision: boolean;
  supportsCodeExecution: boolean;
  maxContextLength: number;
  supportedFormats: string[];
}

/**
 * Interface for provider usage statistics
 */
export interface IProviderUsage {
  providerId: string;
  totalRequests: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  averageResponseTime: number;
  errorRate: number;
  lastUsed: Date;
}

/**
 * Interface for provider health status
 */
export interface IProviderHealth {
  providerId: string;
  isHealthy: boolean;
  latency: number;
  lastCheck: Date;
  errorMessage?: string;
}

/**
 * Interface for provider factory
 */
export interface IProviderFactory {
  createProvider(config: ProviderConfig): Promise<IProvider>;
  getSupportedProviders(): ProviderType[];
  validateConfig(config: ProviderConfig): boolean;
}

/**
 * Main provider interface
 */
export interface IProvider {
  id: string;
  type: ProviderType;
  config: ProviderConfig;
  capabilities: IProviderCapabilities;
  
  /**
   * Initialize the provider
   */
  initialize(): Promise<void>;
  
  /**
   * Generate a response using the provider
   */
  generate(prompt: string, options?: Record<string, any>): Promise<string>;
  
  /**
   * Stream a response using the provider
   */
  stream(prompt: string, options?: Record<string, any>): AsyncIterable<string>;
  
  /**
   * Check provider health
   */
  healthCheck(): Promise<IProviderHealth>;
  
  /**
   * Get usage statistics
   */
  getUsage(): Promise<IProviderUsage>;
  
  /**
   * Cleanup provider resources
   */
  cleanup(): Promise<void>;
}