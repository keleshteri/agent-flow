import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgentType, TaskType } from '@agent-flow/agents';

// Define enums locally since they're not exported from the main package
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

export enum MessageStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
  RETRY = 'retry',
  ERROR = 'error',
}

/**
 * DTO for chat message response
 */
export class ChatMessageDto {
  @ApiProperty({
    description: 'Unique message identifier',
    example: 'msg_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Session identifier',
    example: 'session_123456789',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Message type',
    enum: MessageType,
    example: MessageType.USER,
  })
  type: MessageType;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, I need help with data analysis',
  })
  content: string;

  @ApiPropertyOptional({
    description: 'Agent type that processed the message',
    enum: AgentType,
    example: AgentType.MARY,
  })
  agentType?: AgentType;

  @ApiPropertyOptional({
    description: 'Task type associated with the message',
    enum: TaskType,
    example: TaskType.DATA_ANALYSIS,
  })
  taskType?: TaskType;

  @ApiProperty({
    description: 'Message status',
    enum: MessageStatus,
    example: MessageStatus.DELIVERED,
  })
  status: MessageStatus;

  @ApiProperty({
    description: 'Message metadata',
    example: { processingTime: 1500, confidence: 0.95 },
  })
  metadata: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Message attachments',
    type: 'array',
    items: { type: 'object' },
  })
  attachments?: any[];

  @ApiPropertyOptional({
    description: 'Tool calls made during message processing',
    type: 'array',
    items: { type: 'object' },
  })
  toolCalls?: any[];

  @ApiPropertyOptional({
    description: 'Parent message ID for threaded conversations',
    example: 'msg_987654321',
  })
  parentMessageId?: string;

  @ApiProperty({
    description: 'Message timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'User ID who sent the message',
    example: 'user_123456789',
  })
  userId: string;
}