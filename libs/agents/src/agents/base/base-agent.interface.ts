import { IAgentConfig, TaskType, IAgentContext, IAgentResponse } from '../../types';
import { IEnhancedAgent } from '../../interfaces';
import { Tool } from '@langchain/core/tools';

/**
 * Base interface for all agents
 */
export interface IBaseAgent extends IEnhancedAgent {
  /**
   * Get task-specific prompt for the given task type
   */
  getTaskPrompt(taskType: TaskType): string;

  /**
   * Get agent's specialization description
   */
  getSpecialization(): string;

  /**
   * Get agent's role in the system
   */
  getRole(): string;

  /**
   * Get examples of tasks this agent can handle
   */
  getTaskExamples(taskType?: TaskType): string[];

  /**
   * Validate if the agent can execute a specific task with given context
   */
  validateTaskExecution(taskType: TaskType, context: IAgentContext): Promise<boolean>;

  /**
   * Get recommended next actions after completing a task
   */
  getRecommendedNextActions(taskType: TaskType, result: IAgentResponse): TaskType[];

  /**
   * Get agent's confidence level for handling a specific task
   */
  getTaskConfidence(taskType: TaskType): number;

  /**
   * Get agent's current workload
   */
  getCurrentWorkload(): number;

  /**
   * Check if agent is available for new tasks
   */
  isAvailable(): boolean;

  /**
   * Get agent's priority level for task assignment
   */
  getPriority(): number;

  /**
   * Get agent's collaboration preferences
   */
  getCollaborationPreferences(): {
    preferredPartners: string[];
    canWorkAlone: boolean;
    requiresSupervision: boolean;
  };
}

/**
 * Configuration interface for base agents
 */
export interface IBaseAgentConfig extends Omit<IAgentConfig, 'tools'> {
  /**
   * Agent's specialization area
   */
  specialization: string;

  /**
   * Agent's role in the system
   */
  role: string;

  /**
   * Priority level for task assignment (1-10, higher is more priority)
   */
  priority: number;

  /**
   * Maximum concurrent tasks this agent can handle
   */
  maxConcurrentTasks: number;

  /**
   * Collaboration settings
   */
  collaboration: {
    preferredPartners: string[];
    canWorkAlone: boolean;
    requiresSupervision: boolean;
  };

  /**
   * Task confidence levels (0-1)
   */
  taskConfidence?: Partial<Record<TaskType, number>>;

  /**
   * Custom prompts for specific tasks
   */
  customPrompts?: Partial<Record<TaskType, string>>;

  /**
   * Agent-specific tools and capabilities
   */
  tools: Tool[];

  /**
   * Performance thresholds
   */
  performance: {
    maxResponseTime: number; // in milliseconds
    minAccuracy: number; // 0-1
    maxErrorRate: number; // 0-1
  };
}

/**
 * Factory interface for creating agents
 */
export interface IAgentFactory {
  /**
   * Create an agent instance
   */
  createAgent(config: IBaseAgentConfig): Promise<IBaseAgent>;

  /**
   * Get available agent types
   */
  getAvailableAgentTypes(): string[];

  /**
   * Validate agent configuration
   */
  validateConfig(config: IBaseAgentConfig): boolean;

  /**
   * Get default configuration for an agent type
   */
  getDefaultConfig(agentType: string): IBaseAgentConfig;
}