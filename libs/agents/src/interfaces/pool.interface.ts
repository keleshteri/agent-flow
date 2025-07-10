import { AgentType, TaskType, IAgent, ITaskRequest, ITaskResult } from '../types';
import { IAgentHealthStatus } from './agent.interface';

/**
 * Interface for agent pool configuration
 */
export interface IAgentPoolConfig {
  poolId: string;
  name: string;
  description: string;
  agentTypes: AgentType[];
  minInstances: Record<AgentType, number>;
  maxInstances: Record<AgentType, number>;
  loadBalancingStrategy: 'round_robin' | 'least_connections' | 'weighted' | 'random';
  healthCheckInterval: number; // in seconds
  autoScaling: boolean;
  priority: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for agent instance in pool
 */
export interface IAgentInstance {
  instanceId: string;
  agentType: AgentType;
  poolId: string;
  agent: IAgent;
  status: 'idle' | 'busy' | 'error' | 'maintenance';
  currentLoad: number; // 0-100
  totalTasksCompleted: number;
  totalErrors: number;
  averageResponseTime: number;
  lastActivity: Date;
  createdAt: Date;
  metadata: Record<string, any>;
}

/**
 * Interface for pool statistics
 */
export interface IPoolStatistics {
  poolId: string;
  totalInstances: number;
  activeInstances: number;
  idleInstances: number;
  busyInstances: number;
  errorInstances: number;
  averageLoad: number;
  totalTasksCompleted: number;
  totalErrors: number;
  averageResponseTime: number;
  throughput: number; // tasks per minute
  uptime: number; // in seconds
  lastUpdated: Date;
  agentDistribution: Record<AgentType, number>;
}

/**
 * Interface for pool health status
 */
export interface IPoolHealthStatus {
  poolId: string;
  isHealthy: boolean;
  healthScore: number; // 0-100
  totalInstances: number;
  healthyInstances: number;
  unhealthyInstances: number;
  criticalIssues: string[];
  warnings: string[];
  lastHealthCheck: Date;
  agentHealthStatuses: Record<string, IAgentHealthStatus>;
}

/**
 * Interface for load balancing strategy
 */
export interface ILoadBalancingStrategy {
  name: string;
  description: string;
  
  /**
   * Select the best agent instance for a task
   */
  selectInstance(instances: IAgentInstance[], taskRequest: ITaskRequest): Promise<IAgentInstance | null>;
  
  /**
   * Update instance weights or priorities
   */
  updateWeights(instances: IAgentInstance[]): Promise<void>;
  
  /**
   * Get strategy configuration
   */
  getConfiguration(): Record<string, any>;
}

/**
 * Interface for pool scaling policy
 */
export interface IScalingPolicy {
  policyId: string;
  name: string;
  poolId: string;
  agentType: AgentType;
  scaleUpThreshold: number; // load percentage
  scaleDownThreshold: number; // load percentage
  scaleUpCooldown: number; // in seconds
  scaleDownCooldown: number; // in seconds
  minInstances: number;
  maxInstances: number;
  scaleUpStep: number;
  scaleDownStep: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for pool events
 */
export interface IPoolEvent {
  eventId: string;
  poolId: string;
  type: 'instance_added' | 'instance_removed' | 'instance_error' | 'scaling_triggered' | 'health_check' | 'load_balanced';
  agentType?: AgentType;
  instanceId?: string;
  data: any;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

/**
 * Interface for resource allocation
 */
export interface IResourceAllocation {
  poolId: string;
  agentType: AgentType;
  allocatedCpu: number; // percentage
  allocatedMemory: number; // in MB
  allocatedStorage: number; // in MB
  maxConcurrentTasks: number;
  priority: number;
  reservedInstances: number;
  burstCapacity: number;
}

/**
 * Main agent pool interface
 */
export interface IAgentPool {
  /**
   * Get pool configuration
   */
  getConfig(): IAgentPoolConfig;
  
  /**
   * Update pool configuration
   */
  updateConfig(config: Partial<IAgentPoolConfig>): Promise<void>;
  
  /**
   * Add agent instance to pool
   */
  addInstance(agentType: AgentType, config?: Record<string, any>): Promise<IAgentInstance>;
  
  /**
   * Remove agent instance from pool
   */
  removeInstance(instanceId: string): Promise<void>;
  
  /**
   * Get agent instance by ID
   */
  getInstance(instanceId: string): Promise<IAgentInstance | null>;
  
  /**
   * Get all instances in pool
   */
  getAllInstances(): Promise<IAgentInstance[]>;
  
  /**
   * Get instances by agent type
   */
  getInstancesByType(agentType: AgentType): Promise<IAgentInstance[]>;
  
  /**
   * Get available instances for task execution
   */
  getAvailableInstances(taskType: TaskType): Promise<IAgentInstance[]>;
  
  /**
   * Execute task using pool's load balancing
   */
  executeTask(taskRequest: ITaskRequest): Promise<ITaskResult>;
  
  /**
   * Execute task with specific instance
   */
  executeTaskWithInstance(instanceId: string, taskRequest: ITaskRequest): Promise<ITaskResult>;
  
  /**
   * Get pool statistics
   */
  getStatistics(): Promise<IPoolStatistics>;
  
  /**
   * Get pool health status
   */
  getHealthStatus(): Promise<IPoolHealthStatus>;
  
  /**
   * Perform health check on all instances
   */
  performHealthCheck(): Promise<void>;
  
  /**
   * Scale pool up or down
   */
  scale(agentType: AgentType, targetInstances: number): Promise<void>;
  
  /**
   * Enable auto-scaling
   */
  enableAutoScaling(policy: IScalingPolicy): Promise<void>;
  
  /**
   * Disable auto-scaling
   */
  disableAutoScaling(agentType: AgentType): Promise<void>;
  
  /**
   * Get scaling policies
   */
  getScalingPolicies(): Promise<IScalingPolicy[]>;
  
  /**
   * Update scaling policy
   */
  updateScalingPolicy(policyId: string, updates: Partial<IScalingPolicy>): Promise<void>;
  
  /**
   * Set load balancing strategy
   */
  setLoadBalancingStrategy(strategy: ILoadBalancingStrategy): Promise<void>;
  
  /**
   * Get current load balancing strategy
   */
  getLoadBalancingStrategy(): ILoadBalancingStrategy;
  
  /**
   * Subscribe to pool events
   */
  subscribeToEvents(callback: (event: IPoolEvent) => void): () => void;
  
  /**
   * Get pool event history
   */
  getEventHistory(limit?: number): Promise<IPoolEvent[]>;
  
  /**
   * Clear event history
   */
  clearEventHistory(): Promise<void>;
  
  /**
   * Start pool operations
   */
  start(): Promise<void>;
  
  /**
   * Stop pool operations
   */
  stop(): Promise<void>;
  
  /**
   * Restart pool
   */
  restart(): Promise<void>;
  
  /**
   * Check if pool is running
   */
  isRunning(): boolean;
}

/**
 * Interface for pool manager that manages multiple pools
 */
export interface IPoolManager {
  /**
   * Create a new agent pool
   */
  createPool(config: IAgentPoolConfig): Promise<IAgentPool>;
  
  /**
   * Delete an agent pool
   */
  deletePool(poolId: string): Promise<void>;
  
  /**
   * Get pool by ID
   */
  getPool(poolId: string): Promise<IAgentPool | null>;
  
  /**
   * Get all pools
   */
  getAllPools(): Promise<IAgentPool[]>;
  
  /**
   * Get pools by agent type
   */
  getPoolsByAgentType(agentType: AgentType): Promise<IAgentPool[]>;
  
  /**
   * Route task to best pool
   */
  routeTaskToPool(taskRequest: ITaskRequest): Promise<IAgentPool>;
  
  /**
   * Get global pool statistics
   */
  getGlobalStatistics(): Promise<Record<string, IPoolStatistics>>;
  
  /**
   * Get global health status
   */
  getGlobalHealthStatus(): Promise<Record<string, IPoolHealthStatus>>;
  
  /**
   * Optimize pool distribution
   */
  optimizePoolDistribution(): Promise<void>;
  
  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): Promise<string[]>;
  
  /**
   * Subscribe to global pool events
   */
  subscribeToGlobalEvents(callback: (event: IPoolEvent) => void): () => void;
}