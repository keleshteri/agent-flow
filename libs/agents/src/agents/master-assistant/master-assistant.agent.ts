import { BaseAgent } from '../base/base-agent';
import { IBaseAgent, IBaseAgentConfig } from '../base/base-agent.interface';
import {
  AgentType,
  TaskType,
  IAgentContext,
  IAgentResponse,
  IProvider,
  IAgentConfig
} from '../../types';
import { MASTER_ASSISTANT_PROMPTS } from './master-assistant.prompts';
import { MASTER_ASSISTANT_CONFIG } from './master-assistant.config';

/**
 * Master Assistant Agent - The main coordinator and entry point for the agent system
 * Handles task routing, agent coordination, and high-level decision making
 */
export class MasterAssistantAgent extends BaseAgent implements IBaseAgent {
  private taskHistory: Map<string, IAgentResponse[]> = new Map();
  private agentRecommendations: Map<TaskType, AgentType[]> = new Map();

  constructor(config: IBaseAgentConfig, provider: IProvider) {
    super(config, provider);
    this.initializeAgentRecommendations();
  }

  /**
   * Initialize the Master Assistant with system knowledge
   */
  protected async onInitialize(): Promise<void> {
    console.log('Initializing Master Assistant Agent...');
    // Load system knowledge and agent capabilities
    await this.loadSystemKnowledge();
  }

  /**
   * Handle task completion and update system knowledge
   */
  protected async onTaskCompleted(
    context: IAgentContext,
    response: IAgentResponse
  ): Promise<void> {
    // Store task history for learning
    const sessionHistory = this.taskHistory.get(context.sessionId) || [];
    sessionHistory.push(response);
    this.taskHistory.set(context.sessionId, sessionHistory);

    // Update agent recommendations based on success
    if (response.success) {
      this.updateAgentRecommendations(context.currentTask, response.agentType);
    }
  }

  /**
   * Handle task errors and provide fallback strategies
   */
  protected async onTaskError(
    context: IAgentContext,
    error: Error
  ): Promise<void> {
    console.error(`Master Assistant task error for ${context.currentTask}:`, error.message);
    // Could implement fallback agent selection here
  }

  /**
   * Cleanup Master Assistant resources
   */
  protected async onCleanup(): Promise<void> {
    this.taskHistory.clear();
    this.agentRecommendations.clear();
  }

  /**
   * Handle configuration updates
   */
  protected async onConfigUpdated(config: Partial<IBaseAgentConfig>): Promise<void> {
    console.log('Master Assistant configuration updated');
  }

  /**
   * Handle agent stop
   */
  protected async onStop(): Promise<void> {
    console.log('Master Assistant stopping...');
  }

  /**
   * Update agent configuration
   */
  async updateConfiguration(config: Partial<IAgentConfig>): Promise<void> {
    await this.updateConfig(config);
  }

  /**
   * Get task-specific prompt for the Master Assistant
   */
  getTaskPrompt(taskType: TaskType): string {
    return MASTER_ASSISTANT_PROMPTS[taskType] || MASTER_ASSISTANT_PROMPTS.DEFAULT;
  }

  /**
   * Get agent specialization
   */
  getSpecialization(): string {
    return 'System Coordination and Task Management';
  }

  /**
   * Get agent role
   */
  getRole(): string {
    return 'Master Coordinator';
  }

  /**
   * Get task examples for the Master Assistant
   */
  getTaskExamples(taskType?: TaskType): string[] {
    const examples: Partial<Record<TaskType, string[]>> = {
      [TaskType.GENERAL_ASSISTANCE]: [
        'Help me understand what each agent can do',
        'Which agent should I use for data analysis?',
        'Coordinate multiple agents for a complex task'
      ],
      [TaskType.TASK_COORDINATION]: [
        'Break down this complex project into subtasks',
        'Assign tasks to appropriate agents',
        'Monitor progress across multiple agents'
      ],
      [TaskType.AGENT_ROUTING]: [
        'Route this question to the best agent',
        'Find the most suitable agent for this task',
        'Switch to a different agent based on context'
      ],
      [TaskType.SYSTEM_MANAGEMENT]: [
        'Check system health and agent status',
        'Optimize agent performance',
        'Manage system resources and load balancing'
      ],
      [TaskType.DECISION_MAKING]: [
        'Make strategic decisions about task execution',
        'Evaluate trade-offs between different approaches',
        'Provide executive-level recommendations'
      ]
    };
    
    if (taskType) {
      return examples[taskType] || [];
    }
    
    // Return all examples if no specific task type requested
    return Object.values(examples).flat();
  }

  /**
   * Validate if the Master Assistant can execute a specific task
   */
  async validateTaskExecution(taskType: TaskType, context: IAgentContext): Promise<boolean> {
    // Master Assistant can handle most coordination tasks
    const supportedTasks = [
      TaskType.GENERAL_ASSISTANCE,
      TaskType.TASK_COORDINATION,
      TaskType.AGENT_ROUTING,
      TaskType.SYSTEM_MANAGEMENT,
      TaskType.DECISION_MAKING
    ];
    
    return supportedTasks.includes(taskType);
  }

  /**
   * Get recommended next actions after completing a task
   */
  getRecommendedNextActions(
    taskType: TaskType,
    result: IAgentResponse
  ): TaskType[] {
    switch (taskType) {
      case TaskType.GENERAL_ASSISTANCE:
        return [TaskType.AGENT_ROUTING, TaskType.TASK_COORDINATION];
      case TaskType.TASK_COORDINATION:
        return [TaskType.SYSTEM_MANAGEMENT, TaskType.DECISION_MAKING];
      case TaskType.AGENT_ROUTING:
        return [TaskType.TASK_COORDINATION];
      case TaskType.SYSTEM_MANAGEMENT:
        return [TaskType.DECISION_MAKING];
      case TaskType.DECISION_MAKING:
        return [TaskType.TASK_COORDINATION, TaskType.SYSTEM_MANAGEMENT];
      default:
        return [TaskType.GENERAL_ASSISTANCE];
    }
  }

  /**
   * Get task confidence level (Master Assistant is highly confident in coordination tasks)
   */
  getTaskConfidence(taskType: TaskType): number {
    const confidenceMap: Partial<Record<TaskType, number>> = {
      [TaskType.GENERAL_ASSISTANCE]: 0.95,
      [TaskType.TASK_COORDINATION]: 0.9,
      [TaskType.AGENT_ROUTING]: 0.9,
      [TaskType.SYSTEM_MANAGEMENT]: 0.85,
      [TaskType.DECISION_MAKING]: 0.8
    };
    
    return confidenceMap[taskType] || 0.5;
  }

  /**
   * Get current workload (Master Assistant manages overall system load)
   */
  getCurrentWorkload(): number {
    // Calculate based on active sessions and task complexity
    const activeSessions = this.taskHistory.size;
    const maxSessions = 10; // Configurable
    return Math.min((activeSessions / maxSessions) * 100, 100);
  }

  /**
   * Check if Master Assistant is available
   */
  isAvailable(): boolean {
    return this.getCurrentWorkload() < 80; // Available if under 80% load
  }

  /**
   * Get priority level (Master Assistant has highest priority)
   */
  getPriority(): number {
    return 10; // Highest priority
  }

  /**
   * Get collaboration preferences
   */
  getCollaborationPreferences(): {
    preferredPartners: string[];
    canWorkAlone: boolean;
    requiresSupervision: boolean;
  } {
    return {
      preferredPartners: ['all'], // Can work with any agent
      canWorkAlone: true,
      requiresSupervision: false
    };
  }

  /**
   * Get recommended agent for a specific task type
   */
  getRecommendedAgent(taskType: TaskType): AgentType[] {
    return this.agentRecommendations.get(taskType) || [];
  }

  /**
   * Get task history for a session
   */
  getTaskHistory(sessionId: string): IAgentResponse[] {
    return this.taskHistory.get(sessionId) || [];
  }

  /**
   * Analyze system performance and provide insights
   */
  async analyzeSystemPerformance(): Promise<{
    overallHealth: number;
    recommendations: string[];
    bottlenecks: string[];
  }> {
    // Analyze task history and agent performance
    const totalTasks = Array.from(this.taskHistory.values())
      .flat().length;
    
    const successfulTasks = Array.from(this.taskHistory.values())
      .flat()
      .filter(task => task.success).length;
    
    const successRate = totalTasks > 0 ? successfulTasks / totalTasks : 1;
    
    return {
      overallHealth: successRate * 100,
      recommendations: this.generateRecommendations(successRate),
      bottlenecks: this.identifyBottlenecks()
    };
  }

  /**
   * Route task to the most appropriate agent
   */
  routeTask(taskType: TaskType, context: IAgentContext): {
    recommendedAgent: AgentType;
    confidence: number;
    reasoning: string;
  } {
    const recommendations = this.getRecommendedAgent(taskType);
    const primaryAgent = recommendations[0] || this.getDefaultAgentForTask(taskType);
    
    return {
      recommendedAgent: primaryAgent,
      confidence: this.getRoutingConfidence(taskType, primaryAgent),
      reasoning: this.getRoutingReasoning(taskType, primaryAgent)
    };
  }

  /**
   * Initialize agent recommendations based on task types
   */
  private initializeAgentRecommendations(): void {
    // Set up initial agent-task mappings
    this.agentRecommendations.set(TaskType.DATA_ANALYSIS, [AgentType.MARY]);
    this.agentRecommendations.set(TaskType.RESEARCH, [AgentType.JOHN]);
    this.agentRecommendations.set(TaskType.CREATIVE_WRITING, [AgentType.FRED]);
    this.agentRecommendations.set(TaskType.TECHNICAL_SUPPORT, [AgentType.JANE]);
    this.agentRecommendations.set(TaskType.PROJECT_MANAGEMENT, [AgentType.SARAH]);
    this.agentRecommendations.set(TaskType.CUSTOMER_SERVICE, [AgentType.BOB]);
  }

  /**
   * Load system knowledge and capabilities
   */
  private async loadSystemKnowledge(): Promise<void> {
    // Load agent capabilities, system configuration, etc.
    console.log('Loading system knowledge...');
  }

  /**
   * Update agent recommendations based on performance
   */
  private updateAgentRecommendations(taskType: TaskType, agentType: AgentType): void {
    const current = this.agentRecommendations.get(taskType) || [];
    if (!current.includes(agentType)) {
      current.unshift(agentType); // Add to front as preferred
      this.agentRecommendations.set(taskType, current.slice(0, 3)); // Keep top 3
    }
  }

  /**
   * Generate system recommendations based on performance
   */
  private generateRecommendations(successRate: number): string[] {
    const recommendations: string[] = [];
    
    if (successRate < 0.8) {
      recommendations.push('Consider reviewing agent configurations');
      recommendations.push('Monitor task complexity and agent capabilities');
    }
    
    if (this.getCurrentWorkload() > 70) {
      recommendations.push('Consider scaling up agent instances');
    }
    
    return recommendations;
  }

  /**
   * Identify system bottlenecks
   */
  private identifyBottlenecks(): string[] {
    const bottlenecks: string[] = [];
    
    if (this.getCurrentWorkload() > 80) {
      bottlenecks.push('High system load detected');
    }
    
    // Add more bottleneck detection logic
    
    return bottlenecks;
  }

  /**
   * Get default agent for a task type
   */
  private getDefaultAgentForTask(taskType: TaskType): AgentType {
    // Fallback mapping
    const defaultMapping: Partial<Record<TaskType, AgentType>> = {
      [TaskType.DATA_ANALYSIS]: AgentType.MARY,
      [TaskType.RESEARCH]: AgentType.JOHN,
      [TaskType.CREATIVE_WRITING]: AgentType.FRED,
      [TaskType.TECHNICAL_SUPPORT]: AgentType.JANE,
      [TaskType.PROJECT_MANAGEMENT]: AgentType.SARAH,
      [TaskType.CUSTOMER_SERVICE]: AgentType.BOB
    };
    
    return defaultMapping[taskType] || AgentType.MASTER_ASSISTANT;
  }

  /**
   * Get routing confidence for agent-task combination
   */
  private getRoutingConfidence(taskType: TaskType, agentType: AgentType): number {
    // Calculate confidence based on historical performance
    return 0.8; // Default confidence
  }

  /**
   * Get routing reasoning
   */
  private getRoutingReasoning(taskType: TaskType, agentType: AgentType): string {
    return `Agent ${agentType} is recommended for ${taskType} based on specialization and performance history.`;
  }
}