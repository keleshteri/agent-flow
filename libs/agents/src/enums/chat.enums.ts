/**
 * Enum for message types
 */
export enum MessageType {
  USER = 'user',
  AGENT = 'agent',
  SYSTEM = 'system',
  TOOL_CALL = 'tool_call',
  TOOL_RESULT = 'tool_result',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  DEBUG = 'debug',
}

/**
 * Enum for message status
 */
export enum MessageStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
  RETRY = 'retry',
}

/**
 * Enum for chat session status
 */
export enum ChatSessionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  ENDED = 'ended',
  ARCHIVED = 'archived',
  ERROR = 'error',
}

/**
 * Enum for chat attachment types
 */
export enum ChatAttachmentType {
  FILE = 'file',
  IMAGE = 'image',
  DOCUMENT = 'document',
  URL = 'url',
  CODE = 'code',
  AUDIO = 'audio',
  VIDEO = 'video',
  ARCHIVE = 'archive',
}

/**
 * Enum for chat event types
 */
export enum ChatEventType {
  MESSAGE_SENT = 'message-sent',
  MESSAGE_RECEIVED = 'message-received',
  MESSAGE_UPDATED = 'message-updated',
  MESSAGE_DELETED = 'message-deleted',
  TYPING_START = 'typing-start',
  TYPING_STOP = 'typing-stop',
  AGENT_SWITCH = 'agent-switch',
  TASK_START = 'task-start',
  TASK_COMPLETE = 'task-complete',
  SESSION_START = 'session-start',
  SESSION_END = 'session-end',
  ERROR_OCCURRED = 'error-occurred',
}

/**
 * Enum for chat moderation actions
 */
export enum ChatModerationAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  FLAG = 'flag',
  FILTER = 'filter',
  WARN = 'warn',
  BLOCK = 'block',
  ESCALATE = 'escalate',
}

/**
 * Enum for chat moderation reasons
 */
export enum ChatModerationReason {
  INAPPROPRIATE_CONTENT = 'inappropriate-content',
  SPAM = 'spam',
  PROFANITY = 'profanity',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate-speech',
  VIOLENCE = 'violence',
  ADULT_CONTENT = 'adult-content',
  COPYRIGHT_VIOLATION = 'copyright-violation',
  PRIVACY_VIOLATION = 'privacy-violation',
  SECURITY_THREAT = 'security-threat',
}

/**
 * Enum for chat analytics metrics
 */
export enum ChatAnalyticsMetric {
  MESSAGE_COUNT = 'message-count',
  SESSION_DURATION = 'session-duration',
  RESPONSE_TIME = 'response-time',
  USER_SATISFACTION = 'user-satisfaction',
  ENGAGEMENT_RATE = 'engagement-rate',
  CONVERSION_RATE = 'conversion-rate',
  BOUNCE_RATE = 'bounce-rate',
  RETENTION_RATE = 'retention-rate',
}

/**
 * Enum for chat notification types
 */
export enum ChatNotificationType {
  NEW_MESSAGE = 'new-message',
  MENTION = 'mention',
  AGENT_AVAILABLE = 'agent-available',
  TASK_COMPLETED = 'task-completed',
  SESSION_TIMEOUT = 'session-timeout',
  SYSTEM_ALERT = 'system-alert',
  MAINTENANCE = 'maintenance',
}

/**
 * Enum for chat priority levels
 */
export enum ChatPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

/**
 * Enum for chat interaction modes
 */
export enum ChatInteractionMode {
  TEXT_ONLY = 'text-only',
  MULTIMEDIA = 'multimedia',
  VOICE = 'voice',
  VIDEO = 'video',
  SCREEN_SHARE = 'screen-share',
  COLLABORATIVE = 'collaborative',
}

/**
 * Enum for chat response formats
 */
export enum ChatResponseFormat {
  PLAIN_TEXT = 'plain-text',
  MARKDOWN = 'markdown',
  HTML = 'html',
  JSON = 'json',
  STRUCTURED = 'structured',
  RICH_TEXT = 'rich-text',
}

/**
 * Enum for chat streaming states
 */
export enum ChatStreamingState {
  IDLE = 'idle',
  STARTING = 'starting',
  STREAMING = 'streaming',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error',
  CANCELLED = 'cancelled',
}

/**
 * Enum for chat quality metrics
 */
export enum ChatQualityMetric {
  RELEVANCE = 'relevance',
  ACCURACY = 'accuracy',
  HELPFULNESS = 'helpfulness',
  CLARITY = 'clarity',
  COMPLETENESS = 'completeness',
  TIMELINESS = 'timeliness',
}

/**
 * Enum for chat feedback types
 */
export enum ChatFeedbackType {
  THUMBS_UP = 'thumbs-up',
  THUMBS_DOWN = 'thumbs-down',
  RATING = 'rating',
  COMMENT = 'comment',
  SUGGESTION = 'suggestion',
  BUG_REPORT = 'bug-report',
}

/**
 * Enum for chat export formats
 */
export enum ChatExportFormat {
  JSON = 'json',
  CSV = 'csv',
  TXT = 'txt',
  PDF = 'pdf',
  HTML = 'html',
  XML = 'xml',
}

/**
 * Enum for chat search types
 */
export enum ChatSearchType {
  FULL_TEXT = 'full-text',
  SEMANTIC = 'semantic',
  KEYWORD = 'keyword',
  REGEX = 'regex',
  FUZZY = 'fuzzy',
  ADVANCED = 'advanced',
}

/**
 * Enum for chat archive types
 */
export enum ChatArchiveType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  POLICY_BASED = 'policy-based',
  USER_REQUESTED = 'user-requested',
}

/**
 * Enum for chat security levels
 */
export enum ChatSecurityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
  TOP_SECRET = 'top-secret',
}

/**
 * Enum for chat compliance requirements
 */
export enum ChatComplianceRequirement {
  GDPR = 'gdpr',
  HIPAA = 'hipaa',
  SOX = 'sox',
  PCI_DSS = 'pci-dss',
  COPPA = 'coppa',
  CCPA = 'ccpa',
}