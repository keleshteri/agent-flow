import { BaseMessage, SystemMessage } from '@langchain/core/messages';
import { v4 as uuidv4 } from 'uuid';
import {
  IAgentConfig,
  IAgentContext,
  IAgentResponse,
  AgentType,
  TaskType,
  IProvider} from '../../types';
import { IEnhancedAgent, IAgentHealthStatus, IAgentMetrics } from '../../interfaces';
import { AgentStatus } from '../../enums';

/**
 * Base agent class that provides common functionality for all agents
 */
export abstract class BaseAgent implements IEnhancedAgent {
  abstract updateConfiguration(config: Partial<IAgentConfig>): Promise<void>;
  protected _id: string;
  protected _config: IAgentConfig;
  protected _provider: IProvider;
  protected _status: AgentStatus;
  protected _metrics: IAgentMetrics;
  protected _isInitialized: boolean;
  protected _startTime: Date;
  protected _lastActivity: Date;
  protected _errorCount: number;
  protected _taskCount: number;

  constructor(config: IAgentConfig, provider: IProvider) {
    this._id = config.id || uuidv4();
    this._config = { ...config, id: this._id };
    this._provider = provider;
    this._status = AgentStatus.OFFLINE;
    this._isInitialized = false;
    this._startTime = new Date();
    this._lastActivity = new Date();
    this._errorCount = 0;
    this._taskCount = 0;
    this._metrics = this.initializeMetrics();
  }

  // Core IAgent implementation
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._config.name;
  }

  get type(): AgentType {
    return this._config.type;
  }

  get config(): IAgentConfig {
    return { ...this._config };
  }

  /**
   * Initialize the agent with necessary resources
   */
  async initialize(): Promise<void> {
    try {
      this._status = AgentStatus.INITIALIZING;
      
      // Initialize provider
      await this._provider.initialize();
      
      // Perform agent-specific initialization
      await this.onInitialize();
      
      this._isInitialized = true;
      this._status = AgentStatus.IDLE;
      this._startTime = new Date();
      
      console.log(`Agent ${this.name} (${this.type}) initialized successfully`);
    } catch (error) {
      this._status = AgentStatus.ERROR;
      this._errorCount++;
      throw new Error(`Failed to initialize agent ${this.name}: ${error.message}`);
    }
  }

  /**
   * Execute a task with the given context
   */
  async execute(context: IAgentContext): Promise<IAgentResponse> {
    if (!this._isInitialized) {
      throw new Error(`Agent ${this.name} is not initialized`);
    }

    if (!this.canHandleTask(context.currentTask)) {
      throw new Error(`Agent ${this.name} cannot handle task type: ${context.currentTask}`);
    }

    const startTime = Date.now();
    this._status = AgentStatus.BUSY;
    this._lastActivity = new Date();

    try {
      // Build messages for the provider
      const messages = this.buildMessages(context);
      
      // Execute the task using the provider
      const result = await this._provider.generate(
        this.buildPrompt(context),
        {
          messages,
          temperature: this._config.temperature || 0.7,
          maxTokens: this._config.maxTokens || 2000
        }
      );

      const executionTime = Date.now() - startTime;
      this._taskCount++;
      this._status = AgentStatus.IDLE;

      // Update metrics
      this.updateMetrics(executionTime, true);

      const response: IAgentResponse = {
        agentId: this._id,
        agentType: this.type,
        content: result,
        metadata: {
          executionTime,
          taskType: context.currentTask,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date(),
        success: true
      };

      // Perform post-execution processing
      await this.onTaskCompleted(context, response);

      return response;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this._errorCount++;
      this._status = AgentStatus.ERROR;
      
      // Update metrics
      this.updateMetrics(executionTime, false);

      const response: IAgentResponse = {
        agentId: this._id,
        agentType: this.type,
        content: '',
        metadata: {
          executionTime,
          taskType: context.currentTask,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date(),
        success: false,
        error: error.message
      };

      // Perform error handling
      await this.onTaskError(context, error);

      return response;
    }
  }

  /**
   * Check if agent can handle the specified task
   */
  canHandleTask(task: TaskType): boolean {
    return this._config.availableTasks.includes(task);
  }

  /**
   * Get available tasks for this agent
   */
  getAvailableTasks(): TaskType[] {
    return [...this._config.availableTasks];
  }

  /**
   * Get agent description
   */
  getDescription(): string {
    return this._config.description;
  }

  /**
   * Get system prompt for this agent
   */
  getSystemPrompt(): string {
    return this._config.systemPrompt;
  }

  /**
   * Cleanup agent resources
   */
  async cleanup(): Promise<void> {
    try {
      this._status = AgentStatus.OFFLINE;
      await this._provider.cleanup();
      await this.onCleanup();
      this._isInitialized = false;
      console.log(`Agent ${this.name} cleaned up successfully`);
    } catch (error) {
      console.error(`Error cleaning up agent ${this.name}:`, error);
    }
  }

  /**
   * Update agent configuration
   */
  async updateConfig(config: Partial<IAgentConfig>): Promise<void> {
    this._config = { ...this._config, ...config, id: this._id };
    await this.onConfigUpdated(config);
  }

  // Lifecycle methods
  async start(): Promise<void> {
    if (!this._isInitialized) {
      await this.initialize();
    }
    this._status = AgentStatus.IDLE;
  }

  async stop(): Promise<void> {
    this._status = AgentStatus.OFFLINE;
    await this.onStop();
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  isRunning(): boolean {
    return this._status !== AgentStatus.OFFLINE && this._isInitialized;
  }

  async getHealthStatus(): Promise<IAgentHealthStatus> {
    const now = new Date();
    const uptime = this._isInitialized ? (now.getTime() - this._startTime.getTime()) / 1000 : 0;
    
    return {
      agentId: this._id,
      agentType: this.type,
      isHealthy: this._status !== AgentStatus.ERROR,
      status: this._status as "idle" | "busy" | "error" | "offline",
      currentLoad: this._status === AgentStatus.BUSY ? 100 : 0,
      averageResponseTime: this._metrics.averageResponseTime,
      totalTasksCompleted: this._taskCount,
      totalErrors: this._errorCount,
      lastActivity: this._lastActivity,
      uptime
    };
  }

  // Monitoring methods
  async getMetrics(): Promise<IAgentMetrics> {
    return { ...this._metrics };
  }

  async resetMetrics(): Promise<void> {
    this._metrics = this.initializeMetrics();
    this._errorCount = 0;
    this._taskCount = 0;
  }

  async getPerformanceHistory(): Promise<any[]> {
    // Implementation would depend on storage mechanism
    return [];
  }

  subscribeToMetrics(callback: (metrics: IAgentMetrics) => void): () => void {
    // Implementation would depend on event system
    return () => {};
  }

  // Task execution methods
  async executeTask(taskType: TaskType, context: IAgentContext): Promise<IAgentResponse> {
    const taskContext = { ...context, currentTask: taskType };
    return this.execute(taskContext);
  }

  getEstimatedExecutionTime(taskType: TaskType): number {
    // Default estimation, can be overridden by specific agents
    return 30; // 30 seconds
  }

  async cancelTask(taskId: string): Promise<void> {
    // Implementation would depend on task tracking system
    console.log(`Cancelling task ${taskId} for agent ${this.name}`);
  }

  async getTaskStatus(taskId: string): Promise<string> {
    // Implementation would depend on task tracking system
    return 'unknown';
  }

  // Configuration management
  getConfiguration(): IAgentConfig {
    return { ...this._config };
  }

  async validateConfiguration(config: IAgentConfig): Promise<boolean> {
    return config.type === this.type && config.availableTasks.length > 0;
  }

  async resetToDefault(): Promise<void> {
    // Implementation would depend on default configuration storage
    console.log(`Resetting agent ${this.name} to default configuration`);
  }

  async exportConfiguration(): Promise<string> {
    return JSON.stringify(this._config, null, 2);
  }

  async importConfiguration(configData: string): Promise<void> {
    const config = JSON.parse(configData);
    await this.updateConfig(config);
  }

  // Communication methods
  async sendToAgent(targetAgentId: string, message: any): Promise<void> {
    // Implementation would depend on agent communication system
    console.log(`Sending message from ${this.name} to agent ${targetAgentId}`);
  }

  async broadcast(message: any): Promise<void> {
    // Implementation would depend on agent communication system
    console.log(`Broadcasting message from ${this.name}`);
  }

  subscribeToMessages(callback: (message: any) => void): () => void {
    // Implementation would depend on messaging system
    return () => {};
  }

  async requestCollaboration(targetAgentId: string, task: TaskType): Promise<boolean> {
    // Implementation would depend on collaboration system
    console.log(`Requesting collaboration from ${this.name} with agent ${targetAgentId} for task ${task}`);
    return true;
  }

  // Utility methods
  getCapabilitiesSummary(): string {
    return `Agent ${this.name} (${this.type}) can handle: ${this.getAvailableTasks().join(', ')}`;
  }

  getDocumentation(): string {
    return `${this.getDescription()}\n\nCapabilities: ${this.getCapabilitiesSummary()}`;
  }

  getVersion(): string {
    return '1.0.0';
  }

  /**
   * Get agent's role in the system
   */
  getRole(): string {
    return this._config.name;
  }

  /**
   * Get agent's specialization description
   */
  getSpecialization(): string {
    return this._config.description;
  }

  /**
   * Get agent's current status
   */
  getStatus(): string {
    return this._status.toLowerCase();
  }

  /**
   * Get agent's capabilities
   */
  getCapabilities(): string[] {
    return this._config.availableTasks.map(task => task.toString());
  }

  /**
   * Get agent's current workload (0-100)
   */
  getCurrentWorkload(): number {
    // Calculate workload based on current status and task count
    if (this._status === AgentStatus.BUSY) {
      return Math.min(100, (this._taskCount / (this._config.maxConcurrentTasks || 1)) * 100);
    }
    return 0;
  }

  /**
   * Check if agent is available for new tasks
   */
  isAvailable(): boolean {
    return this._status === AgentStatus.IDLE && this._isInitialized;
  }

  /**
   * Get agent's unique identifier
   */
  getId(): string {
    return this._id;
  }

  /**
   * Get examples of tasks this agent can handle
   */
  getTaskExamples(taskType?: TaskType): string[] {
    // Return generic examples - concrete agents should override this
    return [
      `Handle ${taskType || 'various'} tasks efficiently`,
      `Provide expert assistance in assigned domain`,
      `Collaborate with other agents when needed`
    ];
  }

  /**
   * Validate if the agent can execute a specific task
   */
  async validateTaskExecution(taskType: TaskType, context: IAgentContext): Promise<boolean> {
    if (!this._isInitialized) {
      return false;
    }
    
    return this.canHandleTask(taskType);
  }

  // Protected methods for subclasses to override
  protected abstract onInitialize(): Promise<void>;
  protected abstract onTaskCompleted(context: IAgentContext, response: IAgentResponse): Promise<void>;
  protected abstract onTaskError(context: IAgentContext, error: Error): Promise<void>;
  protected abstract onCleanup(): Promise<void>;
  protected abstract onConfigUpdated(config: Partial<IAgentConfig>): Promise<void>;
  protected abstract onStop(): Promise<void>;

  /**
   * Build messages for the provider
   */
  protected buildMessages(context: IAgentContext): BaseMessage[] {
    const messages: BaseMessage[] = [];
    
    // Add system message
    messages.push(new SystemMessage(this.getSystemPrompt()));
    
    // Add conversation history
    messages.push(...context.conversationHistory);
    
    return messages;
  }

  /**
   * Build prompt for the provider
   */
  protected buildPrompt(context: IAgentContext): string {
    const taskPrompt = this.getTaskPrompt(context.currentTask);
    const contextInfo = this.buildContextInfo(context);
    
    return `${taskPrompt}\n\n${contextInfo}`;
  }

  /**
   * Get task-specific prompt
   */
  protected abstract getTaskPrompt(taskType: TaskType): string;

  /**
   * Build context information
   */
  protected buildContextInfo(context: IAgentContext): string {
    return `Session ID: ${context.sessionId}\nUser ID: ${context.userId}\nTimestamp: ${context.timestamp.toISOString()}`;
  }

  /**
   * Initialize metrics
   */
  private initializeMetrics(): IAgentMetrics {
    return {
      agentId: this._id,
      agentType: this.type,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalTokensUsed: 0,
      totalCost: 0,
      tasksCompleted: {} as Record<TaskType, number>,
      lastReset: new Date()
    };
  }

  /**
   * Update metrics after task execution
   */
  private updateMetrics(executionTime: number, success: boolean): void {
    this._metrics.totalRequests++;
    
    if (success) {
      this._metrics.successfulRequests++;
    } else {
      this._metrics.failedRequests++;
    }
    
    // Update average response time
    const totalTime = this._metrics.averageResponseTime * (this._metrics.totalRequests - 1) + executionTime;
    this._metrics.averageResponseTime = totalTime / this._metrics.totalRequests;
  }
}