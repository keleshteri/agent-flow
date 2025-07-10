/**
 * Enum for system health status
 */
export enum SystemHealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  CRITICAL = 'critical',
  MAINTENANCE = 'maintenance',
  UNKNOWN = 'unknown',
}

/**
 * Enum for system log levels
 */
export enum SystemLogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Enum for system event types
 */
export enum SystemEventType {
  STARTUP = 'startup',
  SHUTDOWN = 'shutdown',
  RESTART = 'restart',
  CONFIGURATION_CHANGE = 'configuration-change',
  AGENT_REGISTERED = 'agent-registered',
  AGENT_UNREGISTERED = 'agent-unregistered',
  AGENT_STARTED = 'agent-started',
  AGENT_STOPPED = 'agent-stopped',
  AGENT_ERROR = 'agent-error',
  TASK_QUEUED = 'task-queued',
  TASK_COMPLETED = 'task-completed',
  TASK_FAILED = 'task-failed',
  SYSTEM_OVERLOAD = 'system-overload',
  HEALTH_CHECK = 'health-check',
  SECURITY_ALERT = 'security-alert',
  PERFORMANCE_ALERT = 'performance-alert',
  RESOURCE_ALERT = 'resource-alert',
}

/**
 * Enum for system alert severity levels
 */
export enum SystemAlertSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency',
}

/**
 * Enum for system configuration types
 */
export enum SystemConfigType {
  CORE = 'core',
  AGENT = 'agent',
  PROVIDER = 'provider',
  CHAT = 'chat',
  WEBSOCKET = 'websocket',
  SECURITY = 'security',
  MONITORING = 'monitoring',
  LOGGING = 'logging',
  PERFORMANCE = 'performance',
  SCALING = 'scaling',
}

/**
 * Enum for system deployment environments
 */
export enum SystemEnvironment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production',
  LOCAL = 'local',
  DEMO = 'demo',
}

/**
 * Enum for system scaling modes
 */
export enum SystemScalingMode {
  MANUAL = 'manual',
  AUTO_HORIZONTAL = 'auto-horizontal',
  AUTO_VERTICAL = 'auto-vertical',
  PREDICTIVE = 'predictive',
  REACTIVE = 'reactive',
  SCHEDULED = 'scheduled',
}

/**
 * Enum for system backup types
 */
export enum SystemBackupType {
  FULL = 'full',
  INCREMENTAL = 'incremental',
  DIFFERENTIAL = 'differential',
  SNAPSHOT = 'snapshot',
  CONTINUOUS = 'continuous',
}

/**
 * Enum for system recovery strategies
 */
export enum SystemRecoveryStrategy {
  RESTART = 'restart',
  FAILOVER = 'failover',
  ROLLBACK = 'rollback',
  CIRCUIT_BREAKER = 'circuit-breaker',
  GRACEFUL_DEGRADATION = 'graceful-degradation',
  MANUAL_INTERVENTION = 'manual-intervention',
}

/**
 * Enum for system maintenance types
 */
export enum SystemMaintenanceType {
  SCHEDULED = 'scheduled',
  EMERGENCY = 'emergency',
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  ADAPTIVE = 'adaptive',
  PERFECTIVE = 'perfective',
}

/**
 * Enum for system security levels
 */
export enum SystemSecurityLevel {
  MINIMAL = 'minimal',
  BASIC = 'basic',
  STANDARD = 'standard',
  ENHANCED = 'enhanced',
  MAXIMUM = 'maximum',
  CUSTOM = 'custom',
}

/**
 * Enum for system authentication methods
 */
export enum SystemAuthMethod {
  API_KEY = 'api-key',
  JWT = 'jwt',
  OAUTH2 = 'oauth2',
  SAML = 'saml',
  LDAP = 'ldap',
  MULTI_FACTOR = 'multi-factor',
  CERTIFICATE = 'certificate',
}

/**
 * Enum for system authorization models
 */
export enum SystemAuthorizationModel {
  RBAC = 'rbac', // Role-Based Access Control
  ABAC = 'abac', // Attribute-Based Access Control
  DAC = 'dac',   // Discretionary Access Control
  MAC = 'mac',   // Mandatory Access Control
  PBAC = 'pbac', // Policy-Based Access Control
}

/**
 * Enum for system monitoring types
 */
export enum SystemMonitoringType {
  HEALTH = 'health',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  USAGE = 'usage',
  AVAILABILITY = 'availability',
  COMPLIANCE = 'compliance',
  BUSINESS = 'business',
}

/**
 * Enum for system metric types
 */
export enum SystemMetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary',
  TIMER = 'timer',
  RATE = 'rate',
}

/**
 * Enum for system storage types
 */
export enum SystemStorageType {
  MEMORY = 'memory',
  DISK = 'disk',
  DATABASE = 'database',
  CACHE = 'cache',
  OBJECT_STORE = 'object-store',
  DISTRIBUTED = 'distributed',
}

/**
 * Enum for system communication protocols
 */
export enum SystemCommunicationProtocol {
  HTTP = 'http',
  HTTPS = 'https',
  WEBSOCKET = 'websocket',
  GRPC = 'grpc',
  TCP = 'tcp',
  UDP = 'udp',
  MESSAGE_QUEUE = 'message-queue',
}

/**
 * Enum for system data formats
 */
export enum SystemDataFormat {
  JSON = 'json',
  XML = 'xml',
  YAML = 'yaml',
  PROTOBUF = 'protobuf',
  AVRO = 'avro',
  CSV = 'csv',
  BINARY = 'binary',
}

/**
 * Enum for system integration types
 */
export enum SystemIntegrationType {
  API = 'api',
  WEBHOOK = 'webhook',
  MESSAGE_QUEUE = 'message-queue',
  DATABASE = 'database',
  FILE_SYSTEM = 'file-system',
  STREAM = 'stream',
  BATCH = 'batch',
}

/**
 * Enum for system compliance standards
 */
export enum SystemComplianceStandard {
  SOC2 = 'soc2',
  ISO_27001 = 'iso-27001',
  GDPR = 'gdpr',
  HIPAA = 'hipaa',
  PCI_DSS = 'pci-dss',
  SOX = 'sox',
  NIST = 'nist',
}

/**
 * Enum for system audit types
 */
export enum SystemAuditType {
  ACCESS = 'access',
  CONFIGURATION = 'configuration',
  DATA = 'data',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  COMPLIANCE = 'compliance',
  OPERATIONAL = 'operational',
}

/**
 * Enum for system notification channels
 */
export enum SystemNotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  SLACK = 'slack',
  WEBHOOK = 'webhook',
  PUSH = 'push',
  IN_APP = 'in-app',
  DASHBOARD = 'dashboard',
}

/**
 * Enum for system resource types
 */
export enum SystemResourceType {
  CPU = 'cpu',
  MEMORY = 'memory',
  STORAGE = 'storage',
  NETWORK = 'network',
  GPU = 'gpu',
  BANDWIDTH = 'bandwidth',
  CONNECTIONS = 'connections',
  THREADS = 'threads',
}

/**
 * Enum for system optimization strategies
 */
export enum SystemOptimizationStrategy {
  PERFORMANCE = 'performance',
  COST = 'cost',
  RELIABILITY = 'reliability',
  SCALABILITY = 'scalability',
  SECURITY = 'security',
  ENERGY = 'energy',
  BALANCED = 'balanced',
}