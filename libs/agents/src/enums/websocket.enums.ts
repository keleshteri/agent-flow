/**
 * Enum for WebSocket event types
 */
export enum WebSocketEventType {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  CONNECTION_ERROR = 'connection-error',
  
  // Chat events
  MESSAGE_SEND = 'message:send',
  MESSAGE_RECEIVE = 'message:receive',
  MESSAGE_STREAM = 'message:stream',
  MESSAGE_UPDATE = 'message:update',
  MESSAGE_DELETE = 'message:delete',
  TYPING_START = 'typing:start',
  TYPING_STOP = 'typing:stop',
  
  // Agent events
  AGENT_SWITCH = 'agent:switch',
  AGENT_STATUS = 'agent:status',
  AGENT_AVAILABLE = 'agent:available',
  AGENT_BUSY = 'agent:busy',
  AGENT_ERROR = 'agent:error',
  
  // Task events
  TASK_START = 'task:start',
  TASK_PROGRESS = 'task:progress',
  TASK_COMPLETE = 'task:complete',
  TASK_ERROR = 'task:error',
  TASK_CANCEL = 'task:cancel',
  
  // Session events
  SESSION_JOIN = 'session:join',
  SESSION_LEAVE = 'session:leave',
  SESSION_UPDATE = 'session:update',
  SESSION_ARCHIVE = 'session:archive',
  SESSION_RESTORE = 'session:restore',
  
  // Room events
  ROOM_JOIN = 'room:join',
  ROOM_LEAVE = 'room:leave',
  ROOM_CREATE = 'room:create',
  ROOM_DELETE = 'room:delete',
  ROOM_UPDATE = 'room:update',
  
  // System events
  SYSTEM_STATUS = 'system:status',
  SYSTEM_MAINTENANCE = 'system:maintenance',
  SYSTEM_ALERT = 'system:alert',
  SYSTEM_NOTIFICATION = 'system:notification',
  
  // Error events
  ERROR = 'error',
  VALIDATION_ERROR = 'validation-error',
  AUTHENTICATION_ERROR = 'authentication-error',
  AUTHORIZATION_ERROR = 'authorization-error',
}

/**
 * Enum for WebSocket connection states
 */
export enum WebSocketConnectionState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTING = 'disconnecting',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
  CLOSED = 'closed',
}

/**
 * Enum for WebSocket message priorities
 */
export enum WebSocketMessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

/**
 * Enum for WebSocket room types
 */
export enum WebSocketRoomType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SESSION = 'session',
  AGENT = 'agent',
  SYSTEM = 'system',
  BROADCAST = 'broadcast',
  TEMPORARY = 'temporary',
}

/**
 * Enum for WebSocket authentication methods
 */
export enum WebSocketAuthMethod {
  TOKEN = 'token',
  API_KEY = 'api-key',
  SESSION = 'session',
  CERTIFICATE = 'certificate',
  OAUTH = 'oauth',
  NONE = 'none',
}

/**
 * Enum for WebSocket error codes
 */
export enum WebSocketErrorCode {
  NORMAL_CLOSURE = 1000,
  GOING_AWAY = 1001,
  PROTOCOL_ERROR = 1002,
  UNSUPPORTED_DATA = 1003,
  NO_STATUS_RECEIVED = 1005,
  ABNORMAL_CLOSURE = 1006,
  INVALID_FRAME_PAYLOAD_DATA = 1007,
  POLICY_VIOLATION = 1008,
  MESSAGE_TOO_BIG = 1009,
  MANDATORY_EXTENSION = 1010,
  INTERNAL_ERROR = 1011,
  SERVICE_RESTART = 1012,
  TRY_AGAIN_LATER = 1013,
  BAD_GATEWAY = 1014,
  TLS_HANDSHAKE = 1015,
  
  // Custom error codes
  AUTHENTICATION_FAILED = 4001,
  AUTHORIZATION_FAILED = 4002,
  RATE_LIMITED = 4003,
  INVALID_MESSAGE = 4004,
  SESSION_EXPIRED = 4005,
  ROOM_NOT_FOUND = 4006,
  AGENT_UNAVAILABLE = 4007,
  SYSTEM_OVERLOAD = 4008,
}

/**
 * Enum for WebSocket rate limiting strategies
 */
export enum WebSocketRateLimitStrategy {
  FIXED_WINDOW = 'fixed-window',
  SLIDING_WINDOW = 'sliding-window',
  TOKEN_BUCKET = 'token-bucket',
  LEAKY_BUCKET = 'leaky-bucket',
  ADAPTIVE = 'adaptive',
}

/**
 * Enum for WebSocket monitoring metrics
 */
export enum WebSocketMonitoringMetric {
  CONNECTION_COUNT = 'connection-count',
  MESSAGE_COUNT = 'message-count',
  ERROR_RATE = 'error-rate',
  LATENCY = 'latency',
  THROUGHPUT = 'throughput',
  BANDWIDTH = 'bandwidth',
  UPTIME = 'uptime',
  MEMORY_USAGE = 'memory-usage',
}

/**
 * Enum for WebSocket security levels
 */
export enum WebSocketSecurityLevel {
  NONE = 'none',
  BASIC = 'basic',
  STANDARD = 'standard',
  ENHANCED = 'enhanced',
  MAXIMUM = 'maximum',
}

/**
 * Enum for WebSocket compression types
 */
export enum WebSocketCompressionType {
  NONE = 'none',
  DEFLATE = 'deflate',
  GZIP = 'gzip',
  BROTLI = 'brotli',
  LZ4 = 'lz4',
}

/**
 * Enum for WebSocket heartbeat types
 */
export enum WebSocketHeartbeatType {
  PING_PONG = 'ping-pong',
  CUSTOM_MESSAGE = 'custom-message',
  HTTP_POLLING = 'http-polling',
  NONE = 'none',
}

/**
 * Enum for WebSocket load balancing strategies
 */
export enum WebSocketLoadBalancingStrategy {
  ROUND_ROBIN = 'round-robin',
  LEAST_CONNECTIONS = 'least-connections',
  WEIGHTED = 'weighted',
  RANDOM = 'random',
  HASH_BASED = 'hash-based',
  GEOGRAPHIC = 'geographic',
}

/**
 * Enum for WebSocket scaling strategies
 */
export enum WebSocketScalingStrategy {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  AUTO_SCALE = 'auto-scale',
  PREDICTIVE = 'predictive',
  REACTIVE = 'reactive',
  MANUAL = 'manual',
}

/**
 * Enum for WebSocket protocol versions
 */
export enum WebSocketProtocolVersion {
  RFC_6455 = 'rfc-6455',
  HYBI_00 = 'hybi-00',
  HYBI_07 = 'hybi-07',
  HYBI_08 = 'hybi-08',
  HYBI_13 = 'hybi-13',
}

/**
 * Enum for WebSocket transport types
 */
export enum WebSocketTransportType {
  WEBSOCKET = 'websocket',
  POLLING = 'polling',
  LONG_POLLING = 'long-polling',
  SERVER_SENT_EVENTS = 'server-sent-events',
  FLASHSOCKET = 'flashsocket',
}

/**
 * Enum for WebSocket middleware types
 */
export enum WebSocketMiddlewareType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  RATE_LIMITING = 'rate-limiting',
  LOGGING = 'logging',
  MONITORING = 'monitoring',
  COMPRESSION = 'compression',
  ENCRYPTION = 'encryption',
  VALIDATION = 'validation',
}

/**
 * Enum for WebSocket plugin types
 */
export enum WebSocketPluginType {
  AUTHENTICATION = 'authentication',
  MONITORING = 'monitoring',
  ANALYTICS = 'analytics',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  INTEGRATION = 'integration',
  CUSTOM = 'custom',
}

/**
 * Enum for WebSocket deployment modes
 */
export enum WebSocketDeploymentMode {
  STANDALONE = 'standalone',
  CLUSTER = 'cluster',
  DISTRIBUTED = 'distributed',
  CLOUD = 'cloud',
  EDGE = 'edge',
  HYBRID = 'hybrid',
}