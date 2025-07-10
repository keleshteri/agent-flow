import {
  IAgentConfig,
  IAgentContext,
  IAgentResponse,
  AgentType,
  TaskType,
  ITask,
  ITaskResult,
  TaskComplexity,
  AgentStatus,
  IAgentMetrics,
  ICollaborationPreference
} from '../../types';
import { BaseAgent } from '../base/base-agent';
import { FRED_CONFIG } from './fred.config';
import { IProvider } from '../../types/provider.types';

/**
 * Fred Agent - Creative Content Specialist
 * Specializes in creative writing, content creation, design concepts, and multimedia content
 */
export class FredAgent extends BaseAgent {
  private activeTasks: Map<string, ITask> = new Map();
  private logger = console; // Simple logger for now

  /**
   * Constructor for Fred Agent
   * @param config - Agent configuration
   * @param provider - AI provider instance
   */
  constructor(config: IAgentConfig, provider: IProvider) {
    super(config, provider);
  }

  // Implement required abstract methods from BaseAgent

  /**
   * Initialize Fred agent with necessary resources
   */
  protected async onInitialize(): Promise<void> {
    try {
      this._status = AgentStatus.READY;
      this.logger.log('Fred Agent initialized successfully');
    } catch (error) {
      this._status = AgentStatus.ERROR;
      throw error;
    }
  }

  /**
   * Cleanup Fred agent resources
   */
  protected async onCleanup(): Promise<void> {
    this.activeTasks.clear();
    this.logger.log('Fred Agent cleaned up successfully');
  }

  /**
   * Handle configuration updates
   */
  protected async onConfigUpdated(config: Partial<IAgentConfig>): Promise<void> {
    this.logger.log('Fred Agent configuration updated');
  }

  /**
   * Handle agent stop
   */
  protected async onStop(): Promise<void> {
    this._status = AgentStatus.OFFLINE;
    this.logger.log('Fred Agent stopped');
  }

  /**
   * Update agent configuration
   */
  async updateConfiguration(config: Partial<IAgentConfig>): Promise<void> {
    this._config = { ...this._config, ...config };
    await this.onConfigUpdated(config);
  }

  /**
   * Handle task completion (fix signature to match base class)
   */
  protected async onTaskCompleted(context: IAgentContext, response: IAgentResponse): Promise<void> {
    this.logger.log(`Fred completed ${context.currentTask} task successfully`);
  }

  /**
   * Handle task errors
   */
  protected async onTaskError(context: IAgentContext, error: Error): Promise<void> {
    this.logger.error(`Fred encountered error in ${context.currentTask}: ${error.message}`);
  }

  /**
   * Get task-specific prompt for Fred
   */
  protected getTaskPrompt(taskType: TaskType): string {
    const prompts: Partial<Record<TaskType, string>> = {
      [TaskType.CONTENT_CREATION]: 'Create engaging and creative content that resonates with the target audience...',
      [TaskType.CREATIVE_WRITING]: 'Write compelling and imaginative content with strong narrative elements...',
      [TaskType.DESIGN_CONCEPTS]: 'Develop innovative design concepts that balance creativity with functionality...',
      [TaskType.MULTIMEDIA_CONTENT]: 'Plan and conceptualize multimedia content that tells a cohesive story...',
      [TaskType.MARKETING]: 'Create marketing content that drives engagement and conversions...',
      [TaskType.COMMUNICATION]: 'Craft clear and persuasive communication materials...'
    };
    
    return prompts[taskType] || 'Apply creative thinking and content expertise to complete this task...';
  }

  /**
   * Get task examples for Fred
   */
  getTaskExamples(taskType?: TaskType): string[] {
    const examples: Partial<Record<TaskType, string[]>> = {
      [TaskType.CONTENT_CREATION]: [
        'Write a blog post about sustainable technology',
        'Create social media content for a product launch'
      ],
      [TaskType.CREATIVE_WRITING]: [
        'Write a short story about time travel',
        'Create compelling product descriptions'
      ],
      [TaskType.DESIGN_CONCEPTS]: [
        'Design a user interface for a mobile app',
        'Create a brand identity concept'
      ],
      [TaskType.MULTIMEDIA_CONTENT]: [
        'Plan a video marketing campaign',
        'Design an infographic about data trends'
      ],
      [TaskType.MARKETING]: [
        'Develop a marketing strategy for a new product',
        'Create email marketing campaigns'
      ],
      [TaskType.COMMUNICATION]: [
        'Draft professional emails and presentations',
        'Create internal communication materials'
      ]
    };
    
    if (taskType) {
      return examples[taskType] || [];
    }
    
    // Return all examples if no specific task type requested
    return Object.values(examples).flat();
  }

  /**
   * Get current workload
   */
  getCurrentWorkload(): number {
    return this.activeTasks.size;
  }

  /**
   * Check if agent is available for new tasks
   */
  isAvailable(): boolean {
    if (this._status !== AgentStatus.READY) return false;
    return this.activeTasks.size < (this._config.maxConcurrentTasks || 1);
  }

  /**
   * Get agent's collaboration preferences
   */
  getCollaborationPreferences(): ICollaborationPreference[] {
    return [
      {
        agentType: AgentType.MARY,
        preferredTasks: [TaskType.CONTENT_CREATION, TaskType.MARKETING],
        collaborationStyle: 'data-driven creativity',
        communicationFrequency: 'as-needed'
      },
      {
        agentType: AgentType.JOHN,
        preferredTasks: [TaskType.CONTENT_CREATION, TaskType.RESEARCH],
        collaborationStyle: 'research-backed content',
        communicationFrequency: 'regular'
      },
      {
        agentType: AgentType.JANE,
        preferredTasks: [TaskType.DESIGN_CONCEPTS, TaskType.MULTIMEDIA_CONTENT],
        collaborationStyle: 'technical implementation',
        communicationFrequency: 'frequent'
      }
    ];
  }

  /**
   * Get agent specialization
   */
  getSpecialization(): string {
    return 'Creative Content Specialist';
  }

  /**
   * Get agent role
   */
  getRole(): string {
    return 'Content Creator & Design Conceptualist';
  }

  /**
   * Get task confidence level
   */
  getTaskConfidence(taskType: TaskType): number {
    const confidence: Partial<Record<TaskType, number>> = {
      [TaskType.CONTENT_CREATION]: 0.95,
      [TaskType.CREATIVE_WRITING]: 0.9,
      [TaskType.DESIGN_CONCEPTS]: 0.85,
      [TaskType.MULTIMEDIA_CONTENT]: 0.8,
      [TaskType.MARKETING]: 0.85,
      [TaskType.COMMUNICATION]: 0.8
    };
    
    return confidence[taskType] || 0.5;
  }

  /**
   * Get agent priority
   */
  getPriority(): number {
    return this._config.priority || 7;
  }

  /**
   * Validate task execution
   */
  async validateTaskExecution(taskType: TaskType, context: IAgentContext): Promise<boolean> {
    return this.canHandleTask(taskType) && this.isAvailable();
  }

  /**
   * Get recommended next actions
   */
  getRecommendedNextActions(taskType: TaskType, result: IAgentResponse): TaskType[] {
    const recommendations: Partial<Record<TaskType, TaskType[]>> = {
      [TaskType.CONTENT_CREATION]: [TaskType.MARKETING, TaskType.DESIGN_CONCEPTS],
      [TaskType.CREATIVE_WRITING]: [TaskType.CONTENT_CREATION, TaskType.COMMUNICATION],
      [TaskType.DESIGN_CONCEPTS]: [TaskType.MULTIMEDIA_CONTENT, TaskType.CONTENT_CREATION]
    };
    
    return recommendations[taskType] || [];
  }
}