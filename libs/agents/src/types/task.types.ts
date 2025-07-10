import { AgentType } from './agent.types';
import { TaskType, TaskStatus, TaskPriority, TaskComplexity } from '../enums/task.enums';

// Re-export TaskType, TaskStatus, TaskPriority, TaskComplexity and AgentType for external use
export { TaskType, TaskStatus, TaskPriority, TaskComplexity, AgentType };

// TaskPriority and TaskStatus are now defined in ../enums/task.enums.ts
// They are imported and re-exported above

/**
 * Interface for task input parameters
 */
export interface ITaskInput {
  prompt: string;
  context?: Record<string, any>;
  attachments?: ITaskAttachment[];
  requirements?: string[];
  constraints?: string[];
}

/**
 * Interface for task attachments
 */
export interface ITaskAttachment {
  id: string;
  name: string;
  type: 'file' | 'url' | 'text' | 'image';
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for task output
 */
export interface ITaskOutput {
  result: string;
  artifacts?: ITaskArtifact[];
  metadata: Record<string, any>;
  executionTime: number;
  tokensUsed?: number;
}

/**
 * Interface for task artifacts (generated files, documents, etc.)
 */
export interface ITaskArtifact {
  id: string;
  name: string;
  type: 'document' | 'code' | 'diagram' | 'specification' | 'checklist';
  content: string;
  format: 'markdown' | 'json' | 'yaml' | 'typescript' | 'html' | 'plain';
  metadata?: Record<string, any>;
}

/**
 * Interface for task definition
 */
export interface ITaskDefinition {
  id: string;
  type: TaskType;
  name: string;
  description: string;
  priority: TaskPriority;
  estimatedDuration?: number; // in minutes
  requiredAgentTypes: AgentType[];
  prerequisites?: TaskType[];
  deliverables: string[];
  acceptanceCriteria: string[];
}

/**
 * Interface for task execution request
 */
export interface ITaskRequest {
  id: string;
  taskType: TaskType;
  input: ITaskInput;
  priority: TaskPriority;
  requestedAgentType?: AgentType;
  sessionId: string;
  userId: string;
  deadline?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Interface for task execution result
 */
export interface ITaskResult {
  taskId: string;
  taskType: TaskType;
  status: TaskStatus;
  output?: ITaskOutput;
  error?: string;
  executedBy: AgentType;
  startTime: Date;
  endTime?: Date;
  metadata: Record<string, any>;
}

/**
 * Interface for task progress tracking
 */
export interface ITaskProgress {
  taskId: string;
  status: TaskStatus;
  progress: number; // 0-100
  currentStep?: string;
  estimatedTimeRemaining?: number; // in minutes
  lastUpdated: Date;
}

/**
 * Type for task validation function
 */
export type TaskValidator = (input: ITaskInput) => Promise<boolean>;

/**
 * Type for task execution function
 */
export type TaskExecutor = (input: ITaskInput, context: Record<string, any>) => Promise<ITaskOutput>;

/**
 * Interface for task execution (used by agents)
 */
export interface ITask {
  id: string;
  type: TaskType;
  complexity: TaskComplexity;
  input: ITaskInput;
  priority: TaskPriority;
  sessionId: string;
  userId: string;
  deadline?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}