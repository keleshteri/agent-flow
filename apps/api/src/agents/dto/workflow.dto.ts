import { IsString, IsOptional, IsArray, IsEnum, ValidateNested, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType, TaskPriority } from '@agent-flow/agents';
import { TaskContext, TaskRequirements } from './create-task.dto';

/**
 * Workflow execution strategy
 */
export enum WorkflowStrategy {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  CONDITIONAL = 'conditional',
  ADAPTIVE = 'adaptive'
}

/**
 * Step dependency type
 */
export enum DependencyType {
  BLOCKING = 'blocking',
  NON_BLOCKING = 'non-blocking',
  CONDITIONAL = 'conditional'
}

/**
 * Workflow step condition
 */
export class StepCondition {
  @ApiProperty({ description: 'Field to evaluate' })
  @IsString()
  field: string;

  @ApiProperty({ description: 'Operator for comparison' })
  @IsEnum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'exists'])
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';

  @ApiPropertyOptional({ description: 'Value to compare against' })
  @IsOptional()
  value?: any;
}

/**
 * Step dependency definition
 */
export class StepDependency {
  @ApiProperty({ description: 'ID of the step this depends on' })
  @IsString()
  stepId: string;

  @ApiProperty({ 
    description: 'Type of dependency',
    enum: DependencyType
  })
  @IsEnum(DependencyType)
  type: DependencyType;

  @ApiPropertyOptional({ 
    description: 'Condition that must be met for conditional dependencies',
    type: StepCondition
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StepCondition)
  condition?: StepCondition;
}

/**
 * Individual workflow step
 */
export class WorkflowStep {
  @ApiProperty({ description: 'Unique identifier for the step' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Human-readable name for the step' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Type of task for this step',
    enum: TaskType
  })
  @IsEnum(TaskType)
  taskType: TaskType;

  @ApiProperty({ description: 'Detailed description of what this step should accomplish' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ 
    description: 'Priority level for this step',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiPropertyOptional({ description: 'Preferred agent ID to handle this step' })
  @IsOptional()
  @IsString()
  agentId?: string;

  @ApiPropertyOptional({ 
    description: 'Context specific to this step',
    type: TaskContext
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskContext)
  context?: TaskContext;

  @ApiPropertyOptional({ 
    description: 'Requirements specific to this step',
    type: TaskRequirements
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskRequirements)
  requirements?: TaskRequirements;

  @ApiPropertyOptional({ description: 'Parameters specific to this step' })
  @IsOptional()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Dependencies for this step',
    type: [StepDependency]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDependency)
  dependencies?: StepDependency[];

  @ApiPropertyOptional({ 
    description: 'Conditions that must be met before executing this step',
    type: [StepCondition]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepCondition)
  conditions?: StepCondition[];

  @ApiPropertyOptional({ 
    description: 'Whether this step can be skipped if conditions are not met',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  optional?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Maximum number of retry attempts for this step',
    minimum: 0,
    maximum: 5,
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  maxRetries?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Timeout in milliseconds for this step',
    minimum: 1000
  })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  timeout?: number;

  @ApiPropertyOptional({ description: 'Expected outputs from this step' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expectedOutputs?: string[];

  @ApiPropertyOptional({ description: 'Tags for categorizing this step' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

/**
 * Workflow configuration options
 */
export class WorkflowConfig {
  @ApiPropertyOptional({ 
    description: 'Execution strategy for the workflow',
    enum: WorkflowStrategy,
    default: WorkflowStrategy.SEQUENTIAL
  })
  @IsOptional()
  @IsEnum(WorkflowStrategy)
  strategy?: WorkflowStrategy = WorkflowStrategy.SEQUENTIAL;

  @ApiPropertyOptional({ 
    description: 'Maximum number of parallel steps (for parallel strategy)',
    minimum: 1,
    maximum: 10,
    default: 3
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  maxParallelSteps?: number = 3;

  @ApiPropertyOptional({ 
    description: 'Whether to continue execution if a non-critical step fails',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  continueOnError?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Global timeout for the entire workflow in milliseconds',
    minimum: 5000
  })
  @IsOptional()
  @IsNumber()
  @Min(5000)
  globalTimeout?: number;

  @ApiPropertyOptional({ 
    description: 'Whether to save intermediate results',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  saveIntermediateResults?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Whether to enable automatic rollback on failure',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  enableRollback?: boolean = false;

  @ApiPropertyOptional({ description: 'Custom configuration parameters' })
  @IsOptional()
  customConfig?: Record<string, any>;
}

/**
 * DTO for creating and executing workflows
 */
export class WorkflowDto {
  @ApiProperty({ description: 'Unique identifier for the workflow' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Human-readable name for the workflow' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Detailed description of the workflow purpose and goals' })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Version of the workflow',
    default: '1.0.0'
  })
  @IsOptional()
  @IsString()
  version?: string = '1.0.0';

  @ApiPropertyOptional({ 
    description: 'Overall priority for the workflow',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiPropertyOptional({ 
    description: 'Global context for the entire workflow',
    type: TaskContext
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskContext)
  context?: TaskContext;

  @ApiProperty({ 
    description: 'Steps that make up the workflow',
    type: [WorkflowStep]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowStep)
  steps: WorkflowStep[];

  @ApiPropertyOptional({ 
    description: 'Configuration options for workflow execution',
    type: WorkflowConfig
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkflowConfig)
  config?: WorkflowConfig;

  @ApiPropertyOptional({ description: 'Tags for categorizing and filtering workflows' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Expected deliverables from the entire workflow' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deliverables?: string[];

  @ApiPropertyOptional({ description: 'Metadata for the workflow' })
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for workflow execution status
 */
export class WorkflowStatusDto {
  @ApiProperty({ description: 'Workflow ID' })
  id: string;

  @ApiProperty({ description: 'Current status of the workflow' })
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

  @ApiProperty({ description: 'Current step being executed' })
  currentStep?: string;

  @ApiProperty({ description: 'Number of completed steps' })
  completedSteps: number;

  @ApiProperty({ description: 'Total number of steps' })
  totalSteps: number;

  @ApiProperty({ description: 'Progress percentage' })
  progress: number;

  @ApiProperty({ description: 'Start time of workflow execution' })
  startTime: Date;

  @ApiPropertyOptional({ description: 'End time of workflow execution' })
  endTime?: Date;

  @ApiPropertyOptional({ description: 'Error message if workflow failed' })
  error?: string;

  @ApiProperty({ description: 'Results from completed steps' })
  stepResults: Record<string, any>;

  @ApiPropertyOptional({ description: 'Estimated time remaining' })
  estimatedTimeRemaining?: number;
}