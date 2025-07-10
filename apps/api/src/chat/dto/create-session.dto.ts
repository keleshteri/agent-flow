import { IsString, IsNotEmpty, IsOptional, IsObject, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new chat session
 */
export class CreateSessionDto {
  @ApiProperty({
    description: 'The user ID creating the session',
    example: 'user_123456789',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Title for the chat session',
    example: 'Data Analysis Discussion',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the chat session',
    example: 'Discussion about quarterly sales data analysis',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the session',
    example: { department: 'sales', priority: 'high' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}