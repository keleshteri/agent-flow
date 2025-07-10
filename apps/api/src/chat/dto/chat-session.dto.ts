import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgentType, TaskType } from '@agent-flow/agents';
import { ChatMessageDto } from './chat-message.dto';

/**
 * DTO for chat session response
 */
export class ChatSessionDto {
  @ApiProperty({
    description: 'Unique session identifier',
    example: 'session_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who owns the session',
    example: 'user_123456789',
  })
  userId: string;

  @ApiProperty({
    description: 'Session title',
    example: 'Data Analysis Discussion',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Session description',
    example: 'Discussion about quarterly sales data analysis',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Current agent type handling the session',
    enum: AgentType,
    example: AgentType.MARY,
  })
  currentAgentType?: AgentType;

  @ApiPropertyOptional({
    description: 'Current task type being processed',
    enum: TaskType,
    example: TaskType.DATA_ANALYSIS,
  })
  currentTaskType?: TaskType;

  @ApiProperty({
    description: 'Whether the session is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Messages in the session',
    type: [ChatMessageDto],
  })
  messages: ChatMessageDto[];

  @ApiProperty({
    description: 'Session metadata',
    example: { department: 'sales', priority: 'high' },
  })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Session creation timestamp',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Session last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}