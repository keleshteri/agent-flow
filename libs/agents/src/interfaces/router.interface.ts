import { AgentType, TaskType, IAgentContext, ITaskRequest, ITaskResult } from '../types';

/**
 * Interface for routing decision
 */
export interface IRoutingDecision {
  selectedAgent: AgentType;
  confidence: number; // 0-1
  reasoning: string;
  alternativeAgents: AgentType[];
  estimatedExecutionTime: number;
  priority: number;
}

/**
 * Interface for routing criteria
 */
export interface IRoutingCriteria {
  taskType: TaskType;
  context: IAgentContext;
  userPreference?: AgentType;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  requiredCapabilities: string[];
  excludedAgents?: AgentType[];
}

/**
 * Interface for routing strategy
 */
export interface IRoutingStrategy {
  name: string;
  description: string;
  
  /**
   * Determine the best agent for a given task
   */
  route(criteria: IRoutingCriteria): Promise<IRoutingDecision>;
  
  /**
   * Get strategy configuration
   */
  getConfiguration(): Record<string, any>;
  
  /**
   * Update strategy configuration
   */
  updateConfiguration(config: Record<string, any>): void;
}

/**
 * Interface for load balancing
 */
export interface ILoadBalancer {
  /**
   * Get current load for an agent
   */
  getAgentLoad(agentType: AgentType): Promise<number>;
  
  /**
   * Get all agent loads
   */
  getAllAgentLoads(): Promise<Record<AgentType, number>>;
  
  /**
   * Find least loaded agent for a task type
   */
  findLeastLoadedAgent(taskType: TaskType): Promise<AgentType | null>;
  
  /**
   * Update agent load
   */
  updateAgentLoad(agentType: AgentType, load: number): Promise<void>;
}

/**
 * Interface for routing rules
 */
export interface IRoutingRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  conditions: IRoutingCondition[];
  action: IRoutingAction;
  isActive: boolean;
}

/**
 * Interface for routing conditions
 */
export interface IRoutingCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'greaterThan' | 'lessThan';
  value: any;
  caseSensitive?: boolean;
}

/**
 * Interface for routing actions
 */
export interface IRoutingAction {
  type: 'route_to_agent' | 'route_to_pool' | 'reject' | 'queue' | 'escalate';
  target?: AgentType | string;
  parameters?: Record<string, any>;
}

/**
 * Interface for routing analytics
 */
export interface IRoutingAnalytics {
  totalRoutingDecisions: number;
  successfulRoutes: number;
  failedRoutes: number;
  averageDecisionTime: number;
  agentUtilization: Record<AgentType, number>;
  taskTypeDistribution: Record<TaskType, number>;
  routingAccuracy: number;
  lastUpdated: Date;
}

/**
 * Interface for routing history
 */
export interface IRoutingHistory {
  id: string;
  taskId: string;
  taskType: TaskType;
  selectedAgent: AgentType;
  alternativeAgents: AgentType[];
  decisionTime: number;
  confidence: number;
  reasoning: string;
  success: boolean;
  executionTime?: number;
  error?: string;
  timestamp: Date;
}

/**
 * Main agent router interface
 */
export interface IAgentRouter {
  /**
   * Route a task to the most appropriate agent
   */
  route(taskRequest: ITaskRequest): Promise<IRoutingDecision>;
  
  /**
   * Route with custom criteria
   */
  routeWithCriteria(criteria: IRoutingCriteria): Promise<IRoutingDecision>;
  
  /**
   * Get available agents for a task type
   */
  getAvailableAgents(taskType: TaskType): Promise<AgentType[]>;
  
  /**
   * Check if an agent can handle a specific task
   */
  canAgentHandleTask(agentType: AgentType, taskType: TaskType): Promise<boolean>;
  
  /**
   * Add routing strategy
   */
  addStrategy(strategy: IRoutingStrategy): void;
  
  /**
   * Remove routing strategy
   */
  removeStrategy(strategyName: string): void;
  
  /**
   * Set active routing strategy
   */
  setActiveStrategy(strategyName: string): void;
  
  /**
   * Get current routing strategy
   */
  getCurrentStrategy(): IRoutingStrategy;
  
  /**
   * Add routing rule
   */
  addRule(rule: IRoutingRule): void;
  
  /**
   * Remove routing rule
   */
  removeRule(ruleId: string): void;
  
  /**
   * Update routing rule
   */
  updateRule(ruleId: string, updates: Partial<IRoutingRule>): void;
  
  /**
   * Get all routing rules
   */
  getRules(): IRoutingRule[];
  
  /**
   * Get routing analytics
   */
  getAnalytics(): Promise<IRoutingAnalytics>;
  
  /**
   * Get routing history
   */
  getHistory(limit?: number): Promise<IRoutingHistory[]>;
  
  /**
   * Clear routing history
   */
  clearHistory(): Promise<void>;
  
  /**
   * Export routing configuration
   */
  exportConfiguration(): Promise<string>;
  
  /**
   * Import routing configuration
   */
  importConfiguration(configData: string): Promise<void>;
}

/**
 * Interface for smart routing with ML capabilities
 */
export interface ISmartRouter extends IAgentRouter {
  /**
   * Train routing model with historical data
   */
  trainModel(trainingData: IRoutingHistory[]): Promise<void>;
  
  /**
   * Predict best agent using ML model
   */
  predictBestAgent(criteria: IRoutingCriteria): Promise<IRoutingDecision>;
  
  /**
   * Get model accuracy metrics
   */
  getModelAccuracy(): Promise<number>;
  
  /**
   * Update model with feedback
   */
  updateModelWithFeedback(taskId: string, actualResult: ITaskResult): Promise<void>;
}