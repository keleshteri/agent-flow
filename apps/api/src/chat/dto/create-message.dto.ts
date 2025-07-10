import { IsString, IsNotEmpty, IsOptional, IsObject, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new chat message
 */
export class CreateMessageDto {
  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, I need help with data analysis',
    maxLength: 4000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content: string;

  @ApiProperty({
    description: 'The chat session ID',
    example: 'session_123456789',
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: 'The user ID sending the message',
    example: 'user_123456789',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the message',
    example: { priority: 'high', source: 'web' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}