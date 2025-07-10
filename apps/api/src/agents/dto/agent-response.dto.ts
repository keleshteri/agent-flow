import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType, TaskPriority } from '@agent-flow/agents';

/**
 * Agent status information
 */
export class AgentStatusDto {
  @ApiProperty({ description: 'Agent unique identifier' })
  id: string;

  @ApiProperty({ description: 'Agent name/role' })
  name: string;

  @ApiProperty({ description: 'Agent specialization area' })
  specialization: string;

  @ApiProperty({ description: 'Current agent status' })
  status: 'idle' | 'busy' | 'offline' | 'error';

  @ApiProperty({ description: 'Whether the agent is available for new tasks' })
  isAvailable: boolean;

  @ApiProperty({ description: 'Current workload (0-100)' })
  workload: number;

  @ApiProperty({ description: 'Number of active tasks' })
  activeTasks: number;

  @ApiProperty({ description: 'Number of completed tasks' })
  completedTasks: number;

  @ApiProperty({ description: 'Agent uptime in milliseconds' })
  uptime: number;

  @ApiPropertyOptional({ description: 'Last activity timestamp' })
  lastActivity?: Date;

  @ApiPropertyOptional({ description: 'Current error message if any' })
  error?: string;
}

/**
 * Agent capability information
 */
export class AgentCapabilityDto {
  @ApiProperty({ description: 'Task type the agent can handle' })
  taskType: TaskType;

  @ApiProperty({ description: 'Confidence level (0-100)' })
  confidence: number;

  @ApiProperty({ description: 'Estimated completion time in minutes' })
  estimatedTime: number;

  @ApiProperty({ description: 'Whether this is a primary capability' })
  isPrimary: boolean;

  @ApiPropertyOptional({ description: 'Additional requirements or constraints' })
  requirements?: string[];
}

/**
 * Detailed agent information
 */
export class AgentInfoDto extends AgentStatusDto {
  @ApiProperty({ description: 'Agent description' })
  description: string;

  @ApiProperty({ description: 'Agent capabilities', type: [AgentCapabilityDto] })
  capabilities: AgentCapabilityDto[];

  @ApiProperty({ description: 'Supported task types' })
  supportedTasks: TaskType[];

  @ApiProperty({ description: 'Agent configuration version' })
  version: string;

  @ApiProperty({ description: 'Agent creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Agent last update timestamp' })
  updatedAt?: Date;

  @ApiProperty({ description: 'Performance metrics' })
  metrics: {
    successRate: number;
    averageResponseTime: number;
    totalTasksCompleted: number;
    averageRating: number;
  };
}

/**
 * Task execution result
 */
export class TaskResultDto {
  @ApiProperty({ description: 'Task unique identifier' })
  taskId: string;

  @ApiProperty({ description: 'Task type that was executed' })
  taskType: TaskType;

  @ApiProperty({ description: 'Task execution status' })
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

  @ApiProperty({ description: 'Agent that handled the task' })
  agentId: string;

  @ApiProperty({ description: 'Task start time' })
  startTime: Date;

  @ApiPropertyOptional({ description: 'Task completion time' })
  endTime?: Date;

  @ApiProperty({ description: 'Task execution duration in milliseconds' })
  duration: number;

  @ApiPropertyOptional({ description: 'Task result data' })
  result?: any;

  @ApiPropertyOptional({ description: 'Error message if task failed' })
  error?: string;

  @ApiProperty({ description: 'Task priority level' })
  priority: TaskPriority;

  @ApiPropertyOptional({ description: 'Task progress (0-100)' })
  progress?: number;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Workflow execution result
 */
export class WorkflowResultDto {
  @ApiProperty({ description: 'Workflow unique identifier' })
  workflowId: string;

  @ApiProperty({ description: 'Workflow name' })
  name: string;

  @ApiProperty({ description: 'Workflow execution status' })
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

  @ApiProperty({ description: 'Workflow start time' })
  startTime: Date;

  @ApiPropertyOptional({ description: 'Workflow completion time' })
  endTime?: Date;

  @ApiProperty({ description: 'Total execution duration in milliseconds' })
  duration: number;

  @ApiProperty({ description: 'Number of completed steps' })
  completedSteps: number;

  @ApiProperty({ description: 'Total number of steps' })
  totalSteps: number;

  @ApiProperty({ description: 'Overall progress percentage' })
  progress: number;

  @ApiProperty({ description: 'Results from individual steps' })
  stepResults: Record<string, any>;

  @ApiPropertyOptional({ description: 'Final workflow result' })
  result?: any;

  @ApiPropertyOptional({ description: 'Error message if workflow failed' })
  error?: string;

  @ApiProperty({ description: 'Agents involved in the workflow' })
  involvedAgents: string[];

  @ApiPropertyOptional({ description: 'Workflow metadata' })
  metadata?: Record<string, any>;
}

/**
 * Agent performance metrics
 */
export class AgentMetricsDto {
  @ApiProperty({ description: 'Agent identifier' })
  agentId: string;

  @ApiProperty({ description: 'Time period for metrics' })
  period: {
    start: Date;
    end: Date;
  };

  @ApiProperty({ description: 'Task completion statistics' })
  taskStats: {
    total: number;
    completed: number;
    failed: number;
    cancelled: number;
    successRate: number;
  };

  @ApiProperty({ description: 'Performance metrics' })
  performance: {
    averageResponseTime: number;
    averageCompletionTime: number;
    throughput: number; // tasks per hour
    efficiency: number; // 0-100
  };

  @ApiProperty({ description: 'Quality metrics' })
  quality: {
    averageRating: number;
    errorRate: number;
    retryRate: number;
    customerSatisfaction: number;
  };

  @ApiProperty({ description: 'Resource utilization' })
  utilization: {
    averageWorkload: number;
    peakWorkload: number;
    idleTime: number;
    activeTime: number;
  };

  @ApiProperty({ description: 'Task type breakdown' })
  taskBreakdown: Record<TaskType, {
    count: number;
    successRate: number;
    averageTime: number;
  }>;
}

/**
 * Task example for demonstration
 */
export class TaskExampleDto {
  @ApiProperty({ description: 'Task type' })
  taskType: TaskType;

  @ApiProperty({ description: 'Example title' })
  title: string;

  @ApiProperty({ description: 'Example description' })
  description: string;

  @ApiProperty({ description: 'Example parameters' })
  parameters: Record<string, any>;

  @ApiProperty({ description: 'Expected output format' })
  expectedOutput: string;

  @ApiProperty({ description: 'Estimated completion time in minutes' })
  estimatedTime: number;

  @ApiProperty({ description: 'Difficulty level' })
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  @ApiPropertyOptional({ description: 'Prerequisites or requirements' })
  requirements?: string[];
}

/**
 * API response wrapper
 */
export class ApiResponseDto<T = any> {
  @ApiProperty({ description: 'Whether the request was successful' })
  success: boolean;

  @ApiPropertyOptional({ description: 'Response data' })
  data?: T;

  @ApiPropertyOptional({ description: 'Error message if request failed' })
  error?: string;

  @ApiPropertyOptional({ description: 'Additional error details' })
  details?: any;

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: Date;

  @ApiPropertyOptional({ description: 'Request tracking ID' })
  requestId?: string;
}

/**
 * Paginated response
 */
export class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
  @ApiProperty({ description: 'Pagination metadata' })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Health check response
 */
export class HealthCheckDto {
  @ApiProperty({ description: 'Overall system status' })
  status: 'healthy' | 'degraded' | 'unhealthy';

  @ApiProperty({ description: 'System uptime in milliseconds' })
  uptime: number;

  @ApiProperty({ description: 'Number of active agents' })
  activeAgents: number;

  @ApiProperty({ description: 'Number of running tasks' })
  runningTasks: number;

  @ApiProperty({ description: 'System resource usage' })
  resources: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
    };
  };

  @ApiProperty({ description: 'Individual agent health status' })
  agents: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy';
    lastCheck: Date;
    error?: string;
  }>;

  @ApiProperty({ description: 'Health check timestamp' })
  timestamp: Date;
}