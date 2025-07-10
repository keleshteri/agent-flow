import { 
  AgentType, 
  TaskType, 
  IAgent, 
  IAgentConfig, 
  ITaskRequest, 
  ITaskResult,
  IAgentContext,
  ProviderType,
  ProviderConfig
} from '../types';
import { IAgentHealthStatus, IAgentMetrics } from './agent.interface';
import { IRoutingDecision } from './router.interface';

/**
 * Interface for agent registration
 */
export interface IAgentRegistration {
  agentType: AgentType;
  config: IAgentConfig;
  providerConfig: ProviderConfig;
  isActive: boolean;
  registeredAt: Date;
}

/**
 * Interface for system health status
 */
export interface ISystemHealthStatus {
  overallHealth: 'healthy' | 'degraded' | 'unhealthy';
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  errorAgents: number;
  systemLoad: number; // 0-100
  averageResponseTime: number;
  totalTasksInQueue: number;
  lastHealthCheck: Date;
  agentHealthStatuses: Record<AgentType, IAgentHealthStatus>;
}

/**
 * Interface for system metrics
 */
export interface ISystemMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  totalCost: number;
  requestsPerMinute: number;
  agentMetrics: Record<AgentType, IAgentMetrics>;
  taskDistribution: Record<TaskType, number>;
  providerUsage: Record<ProviderType, number>;
  uptime: number; // in seconds
  lastReset: Date;
}

/**
 * Interface for agent scaling configuration
 */
export interface IScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetUtilization: number; // 0-100
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  cooldownPeriod: number; // in seconds
  autoScalingEnabled: boolean;
}

/**
 * Interface for system configuration
 */
export interface ISystemConfig {
  maxConcurrentTasks: number;
  taskTimeout: number; // in seconds
  retryAttempts: number;
  retryDelay: number; // in seconds
  healthCheckInterval: number; // in seconds
  metricsRetentionPeriod: number; // in days
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableMetrics: boolean;
  enableHealthChecks: boolean;
  scalingConfig: Record<AgentType, IScalingConfig>;
}

/**
 * Interface for task queue management
 */
export interface ITaskQueueManager {
  /**
   * Add task to queue
   */
  enqueue(taskRequest: ITaskRequest): Promise<void>;
  
  /**
   * Get next task from queue
   */
  dequeue(): Promise<ITaskRequest | null>;
  
  /**
   * Get queue size
   */
  getQueueSize(): Promise<number>;
  
  /**
   * Get queue status
   */
  getQueueStatus(): Promise<Record<TaskType, number>>;
  
  /**
   * Clear queue
   */
  clearQueue(): Promise<void>;
  
  /**
   * Get queued tasks for specific agent type
   */
  getQueuedTasksForAgent(agentType: AgentType): Promise<ITaskRequest[]>;
  
  /**
   * Remove task from queue
   */
  removeTask(taskId: string): Promise<boolean>;
  
  /**
   * Prioritize task in queue
   */
  prioritizeTask(taskId: string): Promise<boolean>;
}

/**
 * Interface for agent lifecycle management
 */
export interface IAgentLifecycleManager {
  /**
   * Register a new agent
   */
  registerAgent(registration: IAgentRegistration): Promise<void>;
  
  /**
   * Unregister an agent
   */
  unregisterAgent(agentType: AgentType): Promise<void>;
  
  /**
   * Start an agent
   */
  startAgent(agentType: AgentType): Promise<void>;
  
  /**
   * Stop an agent
   */
  stopAgent(agentType: AgentType): Promise<void>;
  
  /**
   * Restart an agent
   */
  restartAgent(agentType: AgentType): Promise<void>;
  
  /**
   * Scale agent instances
   */
  scaleAgent(agentType: AgentType, instanceCount: number): Promise<void>;
  
  /**
   * Get agent instance count
   */
  getAgentInstanceCount(agentType: AgentType): Promise<number>;
}

/**
 * Interface for system monitoring
 */
export interface ISystemMonitoring {
  /**
   * Get system health status
   */
  getSystemHealth(): Promise<ISystemHealthStatus>;
  
  /**
   * Get system metrics
   */
  getSystemMetrics(): Promise<ISystemMetrics>;
  
  /**
   * Get agent health status
   */
  getAgentHealth(agentType: AgentType): Promise<IAgentHealthStatus>;
  
  /**
   * Get all agent health statuses
   */
  getAllAgentHealth(): Promise<Record<AgentType, IAgentHealthStatus>>;
  
  /**
   * Subscribe to health updates
   */
  subscribeToHealthUpdates(callback: (health: ISystemHealthStatus) => void): () => void;
  
  /**
   * Subscribe to metrics updates
   */
  subscribeToMetricsUpdates(callback: (metrics: ISystemMetrics) => void): () => void;
}

/**
 * Interface for configuration management
 */
export interface IConfigurationManager {
  /**
   * Get system configuration
   */
  getSystemConfig(): ISystemConfig;
  
  /**
   * Update system configuration
   */
  updateSystemConfig(config: Partial<ISystemConfig>): Promise<void>;
  
  /**
   * Get agent configuration
   */
  getAgentConfig(agentType: AgentType): Promise<IAgentConfig>;
  
  /**
   * Update agent configuration
   */
  updateAgentConfig(agentType: AgentType, config: Partial<IAgentConfig>): Promise<void>;
  
  /**
   * Export all configurations
   */
  exportConfigurations(): Promise<string>;
  
  /**
   * Import configurations
   */
  importConfigurations(configData: string): Promise<void>;
  
  /**
   * Reset to default configurations
   */
  resetToDefaults(): Promise<void>;
}

/**
 * Main agent manager interface
 */
export interface IAgentManager extends 
  IAgentLifecycleManager,
  ISystemMonitoring,
  IConfigurationManager {
  
  /**
   * Initialize the agent management system
   */
  initialize(): Promise<void>;
  
  /**
   * Shutdown the agent management system
   */
  shutdown(): Promise<void>;
  
  /**
   * Execute a task using the best available agent
   */
  executeTask(taskRequest: ITaskRequest): Promise<ITaskResult>;
  
  /**
   * Execute task with specific agent
   */
  executeTaskWithAgent(agentType: AgentType, taskRequest: ITaskRequest): Promise<ITaskResult>;
  
  /**
   * Get available agents
   */
  getAvailableAgents(): Promise<AgentType[]>;
  
  /**
   * Get agent by type
   */
  getAgent(agentType: AgentType): Promise<IAgent | null>;
  
  /**
   * Get all agents
   */
  getAllAgents(): Promise<Record<AgentType, IAgent>>;
  
  /**
   * Route task to appropriate agent
   */
  routeTask(taskRequest: ITaskRequest): Promise<IRoutingDecision>;
  
  /**
   * Get task queue manager
   */
  getTaskQueueManager(): ITaskQueueManager;
  
  /**
   * Handle system events
   */
  handleSystemEvent(event: ISystemEvent): Promise<void>;
  
  /**
   * Subscribe to system events
   */
  subscribeToSystemEvents(callback: (event: ISystemEvent) => void): () => void;
}

/**
 * Interface for system events
 */
export interface ISystemEvent {
  type: 'agent_started' | 'agent_stopped' | 'agent_error' | 'task_completed' | 'task_failed' | 'system_overload' | 'health_check';
  agentType?: AgentType;
  taskId?: string;
  data: any;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Interface for advanced agent manager with auto-scaling
 */
export interface IAdvancedAgentManager extends IAgentManager {
  /**
   * Enable auto-scaling for an agent type
   */
  enableAutoScaling(agentType: AgentType, config: IScalingConfig): Promise<void>;
  
  /**
   * Disable auto-scaling for an agent type
   */
  disableAutoScaling(agentType: AgentType): Promise<void>;
  
  /**
   * Get auto-scaling status
   */
  getAutoScalingStatus(): Promise<Record<AgentType, boolean>>;
  
  /**
   * Predict system load
   */
  predictSystemLoad(timeHorizon: number): Promise<number>;
  
  /**
   * Optimize agent distribution
   */
  optimizeAgentDistribution(): Promise<void>;
  
  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): Promise<string[]>;
}