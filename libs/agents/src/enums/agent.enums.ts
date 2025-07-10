/**
 * Enum defining all available agent types in the system
 */
export enum AgentType {
  MASTER_ASSISTANT = 'master-assistant',
  MARY = 'mary',
  JOHN = 'john',
  FRED = 'fred',
  JANE = 'jane',
  SARAH = 'sarah',
  BOB = 'bob',
}

/**
 * Enum for agent status
 */
export enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  ERROR = 'error',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  INITIALIZING = 'initializing',
  STOPPING = 'stopping',
  READY = 'ready',
}

/**
 * Enum for agent capabilities
 */
export enum AgentCapability {
  TEXT_GENERATION = 'text-generation',
  CODE_GENERATION = 'code-generation',
  ANALYSIS = 'analysis',
  RESEARCH = 'research',
  PLANNING = 'planning',
  ARCHITECTURE = 'architecture',
  DESIGN = 'design',
  PROJECT_MANAGEMENT = 'project-management',
  QUALITY_ASSURANCE = 'quality-assurance',
  DOCUMENTATION = 'documentation',
  TOOL_CALLING = 'tool-calling',
  VISION = 'vision',
  STREAMING = 'streaming',
}

/**
 * Enum for agent roles
 */
export enum AgentRole {
  ASSISTANT = 'assistant',
  ANALYST = 'analyst',
  PRODUCT_MANAGER = 'product-manager',
  ARCHITECT = 'architect',
  DESIGN_ARCHITECT = 'design-architect',
  PRODUCT_OWNER = 'product-owner',
  SCRUM_MASTER = 'scrum-master',
  SPECIALIST = 'specialist',
  COORDINATOR = 'coordinator',
}

/**
 * Enum for agent specializations
 */
export enum AgentSpecialization {
  GENERAL = 'general',
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  CREATIVE = 'creative',
  ANALYTICAL = 'analytical',
  STRATEGIC = 'strategic',
  OPERATIONAL = 'operational',
  RESEARCH = 'research',
  DEVELOPMENT = 'development',
  DESIGN = 'design',
}

/**
 * Enum for agent interaction modes
 */
export enum AgentInteractionMode {
  SYNCHRONOUS = 'synchronous',
  ASYNCHRONOUS = 'asynchronous',
  STREAMING = 'streaming',
  BATCH = 'batch',
  REAL_TIME = 'real-time',
}

/**
 * Enum for agent communication protocols
 */
export enum AgentCommunicationProtocol {
  HTTP = 'http',
  WEBSOCKET = 'websocket',
  GRPC = 'grpc',
  MESSAGE_QUEUE = 'message-queue',
  EVENT_STREAM = 'event-stream',
}

/**
 * Enum for agent deployment types
 */
export enum AgentDeploymentType {
  LOCAL = 'local',
  CLOUD = 'cloud',
  HYBRID = 'hybrid',
  EDGE = 'edge',
  DISTRIBUTED = 'distributed',
}

/**
 * Enum for agent scaling strategies
 */
export enum AgentScalingStrategy {
  MANUAL = 'manual',
  AUTO_HORIZONTAL = 'auto-horizontal',
  AUTO_VERTICAL = 'auto-vertical',
  PREDICTIVE = 'predictive',
  REACTIVE = 'reactive',
}

/**
 * Enum for agent health check types
 */
export enum AgentHealthCheckType {
  BASIC = 'basic',
  DETAILED = 'detailed',
  PERFORMANCE = 'performance',
  FUNCTIONAL = 'functional',
  INTEGRATION = 'integration',
}

/**
 * Enum for agent error types
 */
export enum AgentErrorType {
  INITIALIZATION_ERROR = 'initialization-error',
  EXECUTION_ERROR = 'execution-error',
  COMMUNICATION_ERROR = 'communication-error',
  TIMEOUT_ERROR = 'timeout-error',
  RESOURCE_ERROR = 'resource-error',
  CONFIGURATION_ERROR = 'configuration-error',
  AUTHENTICATION_ERROR = 'authentication-error',
  PERMISSION_ERROR = 'permission-error',
  VALIDATION_ERROR = 'validation-error',
  UNKNOWN_ERROR = 'unknown-error',
}

/**
 * Enum for agent lifecycle events
 */
export enum AgentLifecycleEvent {
  CREATED = 'created',
  INITIALIZED = 'initialized',
  STARTED = 'started',
  STOPPED = 'stopped',
  RESTARTED = 'restarted',
  UPDATED = 'updated',
  DESTROYED = 'destroyed',
  ERROR_OCCURRED = 'error-occurred',
  HEALTH_CHECK = 'health-check',
}

/**
 * Enum for agent metrics types
 */
export enum AgentMetricType {
  PERFORMANCE = 'performance',
  USAGE = 'usage',
  ERROR_RATE = 'error-rate',
  RESPONSE_TIME = 'response-time',
  THROUGHPUT = 'throughput',
  RESOURCE_UTILIZATION = 'resource-utilization',
  COST = 'cost',
  QUALITY = 'quality',
}

/**
 * Enum for agent configuration types
 */
export enum AgentConfigType {
  SYSTEM = 'system',
  RUNTIME = 'runtime',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  LOGGING = 'logging',
  MONITORING = 'monitoring',
  SCALING = 'scaling',
  NETWORKING = 'networking',
}