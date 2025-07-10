import { BaseMessage } from '@langchain/core/messages';
import { Tool } from '@langchain/core/tools';
import { TaskType } from '../enums/task.enums';

/**
 * Enum defining all available agent types in the system
 */
export enum AgentType {
  MASTER_ASSISTANT = 'master-assistant',
  MARY = 'mary',
  JOHN = 'john',
  FRED = 'fred',
  JANE = 'jane',
  SARAH = 'sarah',
  BOB = 'bob',
}

// TaskType is now defined in ../enums/task.enums.ts
// Import it when needed: import { TaskType } from '../enums/task.enums';

/**
 * Interface defining the structure of an agent configuration
 */
export interface IAgentConfig {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  availableTasks: TaskType[];
  systemPrompt: string;
  tools: Tool[];
  maxTokens?: number;
  temperature?: number;
  priority?: number;
  maxConcurrentTasks?: number;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for agent execution context
 */
export interface IAgentContext {
  sessionId: string;
  userId: string;
  conversationHistory: BaseMessage[];
  currentTask?: TaskType;
  metadata: Record<string, any>;
  timestamp: Date;
}

/**
 * Interface for agent response
 */
export interface IAgentResponse {
  agentId: string;
  agentType: AgentType;
  content: string;
  toolCalls?: any[];
  metadata: Record<string, any>;
  timestamp: Date;
  success: boolean;
  error?: string;
}

/**
 * Interface for agent capabilities
 */
export interface IAgentCapabilities {
  canHandleTask: (task: TaskType) => boolean;
  getAvailableTasks: () => TaskType[];
  getDescription: () => string;
  getSystemPrompt: () => string;
}

/**
 * Type for agent factory function
 */
export type AgentFactory = (config: IAgentConfig) => Promise<IAgent>;

/**
 * Main agent interface
 */
export interface IAgent extends IAgentCapabilities {
  id: string;
  name: string;
  type: AgentType;
  config: IAgentConfig;
  
  /**
   * Execute a task with the given context
   */
  execute(context: IAgentContext): Promise<IAgentResponse>;
  
  /**
   * Initialize the agent with necessary resources
   */
  initialize(config?: IAgentConfig): Promise<void>;
  
  /**
   * Cleanup agent resources
   */
  cleanup(): Promise<void>;
  
  /**
   * Update agent configuration
   */
  updateConfig(config: Partial<IAgentConfig>): Promise<void>;
}

/**
 * Interface for agent collaboration preferences
 */
export interface ICollaborationPreference {
  agentType: AgentType;
  preferredTasks: TaskType[];
  collaborationStyle: string;
  communicationFrequency: 'frequent' | 'regular' | 'as-needed' | 'minimal';
}