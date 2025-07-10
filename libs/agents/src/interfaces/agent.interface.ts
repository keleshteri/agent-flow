import { IAgent, IAgentConfig, IAgentContext, IAgentResponse, AgentType, TaskType } from '../types';

/**
 * Interface for agent lifecycle management
 */
export interface IAgentLifecycle {
  /**
   * Initialize agent with configuration
   */
  initialize(config?: IAgentConfig): Promise<void>;
  
  /**
   * Start agent operations
   */
  start(): Promise<void>;
  
  /**
   * Stop agent operations
   */
  stop(): Promise<void>;
  
  /**
   * Restart agent
   */
  restart(): Promise<void>;
  
  /**
   * Check if agent is running
   */
  isRunning(): boolean;
  
  /**
   * Get agent health status
   */
  getHealthStatus(): Promise<IAgentHealthStatus>;
}

/**
 * Interface for agent health status
 */
export interface IAgentHealthStatus {
  agentId: string;
  agentType: AgentType;
  isHealthy: boolean;
  status: 'idle' | 'busy' | 'error' | 'offline';
  currentLoad: number; // 0-100
  averageResponseTime: number;
  totalTasksCompleted: number;
  totalErrors: number;
  lastActivity: Date;
  uptime: number; // in seconds
  memoryUsage?: number;
  errorMessage?: string;
}

/**
 * Interface for agent metrics
 */
export interface IAgentMetrics {
  agentId: string;
  agentType: AgentType;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  totalCost: number;
  tasksCompleted: Record<TaskType, number>;
  lastReset: Date;
}

/**
 * Interface for agent monitoring
 */
export interface IAgentMonitoring {
  /**
   * Get current metrics
   */
  getMetrics(): Promise<IAgentMetrics>;
  
  /**
   * Reset metrics
   */
  resetMetrics(): Promise<void>;
  
  /**
   * Get performance history
   */
  getPerformanceHistory(timeRange: string): Promise<IAgentPerformanceData[]>;
  
  /**
   * Subscribe to metric updates
   */
  subscribeToMetrics(callback: (metrics: IAgentMetrics) => void): () => void;
}

/**
 * Interface for agent performance data
 */
export interface IAgentPerformanceData {
  timestamp: Date;
  responseTime: number;
  tokensUsed: number;
  taskType: TaskType;
  success: boolean;
  error?: string;
}

/**
 * Interface for agent task execution
 */
export interface IAgentTaskExecution {
  /**
   * Execute a specific task
   */
  executeTask(taskType: TaskType, context: IAgentContext): Promise<IAgentResponse>;
  
  /**
   * Validate if agent can handle the task
   */
  canHandleTask(taskType: TaskType): boolean;
  
  /**
   * Get estimated execution time for a task
   */
  getEstimatedExecutionTime(taskType: TaskType): number;
  
  /**
   * Cancel ongoing task execution
   */
  cancelTask(taskId: string): Promise<void>;
  
  /**
   * Get current task status
   */
  getTaskStatus(taskId: string): Promise<string>;
}

/**
 * Interface for agent configuration management
 */
export interface IAgentConfigurationManager {
  /**
   * Update agent configuration
   */
  updateConfiguration(config: Partial<IAgentConfig>): Promise<void>;
  
  /**
   * Get current configuration
   */
  getConfiguration(): IAgentConfig;
  
  /**
   * Validate configuration
   */
  validateConfiguration(config: IAgentConfig): Promise<boolean>;
  
  /**
   * Reset to default configuration
   */
  resetToDefault(): Promise<void>;
  
  /**
   * Export configuration
   */
  exportConfiguration(): Promise<string>;
  
  /**
   * Import configuration
   */
  importConfiguration(configData: string): Promise<void>;
}

/**
 * Interface for agent communication
 */
export interface IAgentCommunication {
  /**
   * Send message to another agent
   */
  sendToAgent(targetAgentId: string, message: any): Promise<void>;
  
  /**
   * Broadcast message to all agents
   */
  broadcast(message: any): Promise<void>;
  
  /**
   * Subscribe to messages from other agents
   */
  subscribeToMessages(callback: (message: any) => void): () => void;
  
  /**
   * Request collaboration with another agent
   */
  requestCollaboration(targetAgentId: string, task: TaskType): Promise<boolean>;
}

/**
 * Main enhanced agent interface combining all capabilities
 */
export interface IEnhancedAgent extends 
  IAgent, 
  IAgentLifecycle, 
  IAgentMonitoring, 
  IAgentTaskExecution, 
  IAgentConfigurationManager, 
  IAgentCommunication {
  
  /**
   * Get agent capabilities summary
   */
  getCapabilitiesSummary(): string;
  
  /**
   * Get agent documentation
   */
  getDocumentation(): string;
  
  /**
   * Get agent version
   */
  getVersion(): string;
}