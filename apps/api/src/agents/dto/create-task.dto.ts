import { IsString, IsOptional, IsObject, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType, TaskPriority } from '@agent-flow/agents';

/**
 * Task context for providing additional information
 */
export class TaskContext {
  @ApiPropertyOptional({ description: 'Project or domain context' })
  @IsOptional()
  @IsString()
  project?: string;

  @ApiPropertyOptional({ description: 'Target audience or stakeholders' })
  @IsOptional()
  @IsString()
  audience?: string;

  @ApiPropertyOptional({ description: 'Deadline or time constraints' })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiPropertyOptional({ description: 'Budget constraints' })
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiPropertyOptional({ description: 'Quality requirements' })
  @IsOptional()
  @IsString()
  quality?: string;

  @ApiPropertyOptional({ description: 'Dependencies or prerequisites' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * Task requirements for specific task types
 */
export class TaskRequirements {
  @ApiPropertyOptional({ description: 'Technical specifications' })
  @IsOptional()
  @IsObject()
  technical?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Functional requirements' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  functional?: string[];

  @ApiPropertyOptional({ description: 'Non-functional requirements' })
  @IsOptional()
  @IsObject()
  nonFunctional?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Acceptance criteria' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  acceptanceCriteria?: string[];

  @ApiPropertyOptional({ description: 'Constraints and limitations' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  constraints?: string[];
}

/**
 * DTO for creating a new task
 */
export class CreateTaskDto {
  @ApiProperty({ 
    description: 'Type of task to execute',
    enum: TaskType,
    example: TaskType.SOFTWARE_DEVELOPMENT
  })
  @IsEnum(TaskType)
  type: TaskType;

  @ApiProperty({ 
    description: 'Detailed description of the task',
    example: 'Create a REST API endpoint for user authentication'
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({ 
    description: 'Task priority level',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiPropertyOptional({ 
    description: 'Preferred agent ID to handle the task'
  })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiPropertyOptional({ 
    description: 'Task context and environment information',
    type: TaskContext
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskContext)
  context?: TaskContext;

  @ApiPropertyOptional({ 
    description: 'Specific requirements for the task',
    type: TaskRequirements
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskRequirements)
  requirements?: TaskRequirements;

  @ApiPropertyOptional({ 
    description: 'Additional parameters specific to the task type'
  })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Tags for categorizing and filtering tasks'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ 
    description: 'Expected deliverables or output format'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deliverables?: string[];
}