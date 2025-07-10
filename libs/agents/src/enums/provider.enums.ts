/**
 * Enum for supported AI providers
 */
export enum ProviderType {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  OLLAMA = 'ollama',
  ANTHROPIC = 'anthropic',
  AZURE_OPENAI = 'azure-openai',
  HUGGING_FACE = 'hugging-face',
  COHERE = 'cohere',
  PALM = 'palm',
}

/**
 * Enum for OpenAI models
 */
export enum OpenAIModel {
  GPT_4 = 'gpt-4',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_3_5_TURBO_16K = 'gpt-3.5-turbo-16k',
}

/**
 * Enum for Gemini models
 */
export enum GeminiModel {
  GEMINI_PRO = 'gemini-pro',
  GEMINI_PRO_VISION = 'gemini-pro-vision',
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
  GEMINI_ULTRA = 'gemini-ultra',
}

/**
 * Enum for Anthropic models
 */
export enum AnthropicModel {
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
  CLAUDE_3_SONNET = 'claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU = 'claude-3-haiku-20240307',
  CLAUDE_2_1 = 'claude-2.1',
  CLAUDE_2 = 'claude-2.0',
  CLAUDE_INSTANT = 'claude-instant-1.2',
}

/**
 * Enum for provider capabilities
 */
export enum ProviderCapability {
  TEXT_GENERATION = 'text-generation',
  CHAT_COMPLETION = 'chat-completion',
  CODE_GENERATION = 'code-generation',
  FUNCTION_CALLING = 'function-calling',
  VISION = 'vision',
  EMBEDDING = 'embedding',
  FINE_TUNING = 'fine-tuning',
  STREAMING = 'streaming',
  JSON_MODE = 'json-mode',
  SYSTEM_MESSAGES = 'system-messages',
}

/**
 * Enum for provider status
 */
export enum ProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  RATE_LIMITED = 'rate-limited',
  MAINTENANCE = 'maintenance',
  DEPRECATED = 'deprecated',
  INITIALIZING = 'initializing',
}

/**
 * Enum for provider pricing models
 */
export enum ProviderPricingModel {
  PAY_PER_TOKEN = 'pay-per-token',
  PAY_PER_REQUEST = 'pay-per-request',
  SUBSCRIPTION = 'subscription',
  FREE_TIER = 'free-tier',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

/**
 * Enum for provider authentication types
 */
export enum ProviderAuthType {
  API_KEY = 'api-key',
  BEARER_TOKEN = 'bearer-token',
  OAUTH = 'oauth',
  SERVICE_ACCOUNT = 'service-account',
  CERTIFICATE = 'certificate',
  NONE = 'none',
}

/**
 * Enum for provider deployment types
 */
export enum ProviderDeploymentType {
  CLOUD = 'cloud',
  ON_PREMISE = 'on-premise',
  HYBRID = 'hybrid',
  EDGE = 'edge',
  LOCAL = 'local',
}

/**
 * Enum for provider response formats
 */
export enum ProviderResponseFormat {
  TEXT = 'text',
  JSON = 'json',
  STRUCTURED = 'structured',
  STREAMING = 'streaming',
  BINARY = 'binary',
}

/**
 * Enum for provider error types
 */
export enum ProviderErrorType {
  AUTHENTICATION_ERROR = 'authentication-error',
  AUTHORIZATION_ERROR = 'authorization-error',
  RATE_LIMIT_ERROR = 'rate-limit-error',
  QUOTA_EXCEEDED = 'quota-exceeded',
  INVALID_REQUEST = 'invalid-request',
  MODEL_NOT_FOUND = 'model-not-found',
  SERVICE_UNAVAILABLE = 'service-unavailable',
  TIMEOUT_ERROR = 'timeout-error',
  NETWORK_ERROR = 'network-error',
  UNKNOWN_ERROR = 'unknown-error',
}

/**
 * Enum for provider health check types
 */
export enum ProviderHealthCheckType {
  BASIC = 'basic',
  DETAILED = 'detailed',
  PERFORMANCE = 'performance',
  AVAILABILITY = 'availability',
  LATENCY = 'latency',
}

/**
 * Enum for provider metrics
 */
export enum ProviderMetricType {
  REQUEST_COUNT = 'request-count',
  TOKEN_USAGE = 'token-usage',
  RESPONSE_TIME = 'response-time',
  ERROR_RATE = 'error-rate',
  COST = 'cost',
  THROUGHPUT = 'throughput',
  AVAILABILITY = 'availability',
  LATENCY = 'latency',
}

/**
 * Enum for provider configuration types
 */
export enum ProviderConfigType {
  CONNECTION = 'connection',
  AUTHENTICATION = 'authentication',
  MODEL = 'model',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  MONITORING = 'monitoring',
  BILLING = 'billing',
}

/**
 * Enum for provider load balancing strategies
 */
export enum ProviderLoadBalancingStrategy {
  ROUND_ROBIN = 'round-robin',
  LEAST_CONNECTIONS = 'least-connections',
  WEIGHTED = 'weighted',
  RANDOM = 'random',
  HEALTH_BASED = 'health-based',
  COST_BASED = 'cost-based',
  PERFORMANCE_BASED = 'performance-based',
}

/**
 * Enum for provider failover strategies
 */
export enum ProviderFailoverStrategy {
  IMMEDIATE = 'immediate',
  RETRY_THEN_FAILOVER = 'retry-then-failover',
  CIRCUIT_BREAKER = 'circuit-breaker',
  GRADUAL = 'gradual',
  MANUAL = 'manual',
}

/**
 * Enum for provider scaling strategies
 */
export enum ProviderScalingStrategy {
  MANUAL = 'manual',
  AUTO_SCALE = 'auto-scale',
  PREDICTIVE = 'predictive',
  REACTIVE = 'reactive',
  SCHEDULED = 'scheduled',
}

/**
 * Enum for provider security levels
 */
export enum ProviderSecurityLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  ENHANCED = 'enhanced',
  ENTERPRISE = 'enterprise',
  GOVERNMENT = 'government',
}

/**
 * Enum for provider compliance standards
 */
export enum ProviderComplianceStandard {
  SOC2 = 'soc2',
  GDPR = 'gdpr',
  HIPAA = 'hipaa',
  PCI_DSS = 'pci-dss',
  ISO_27001 = 'iso-27001',
  FedRAMP = 'fedramp',
}