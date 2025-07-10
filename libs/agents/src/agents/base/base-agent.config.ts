import { AgentType, TaskType } from '../../types';
import { IBaseAgentConfig } from './base-agent.interface';
import { Tool } from '@langchain/core/tools';

/**
 * Default configuration values for base agents
 */
export const DEFAULT_AGENT_CONFIG = {
  temperature: 0.7,
  maxTokens: 2000,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  priority: 5,
  maxConcurrentTasks: 1,
  performance: {
    maxResponseTime: 30000, // 30 seconds
    minAccuracy: 0.8,
    maxErrorRate: 0.1
  },
  collaboration: {
    preferredPartners: [],
    canWorkAlone: true,
    requiresSupervision: false
  }
};

/**
 * Base agent configuration builder
 */
export class BaseAgentConfigBuilder {
  private config: Partial<IBaseAgentConfig> = {};

  /**
   * Set agent basic information
   */
  setBasicInfo(name: string, type: AgentType, description: string): this {
    this.config.name = name;
    this.config.type = type;
    this.config.description = description;
    return this;
  }

  /**
   * Set agent specialization and role
   */
  setRole(specialization: string, role: string): this {
    this.config.specialization = specialization;
    this.config.role = role;
    return this;
  }

  /**
   * Set available tasks
   */
  setAvailableTasks(tasks: TaskType[]): this {
    this.config.availableTasks = tasks;
    return this;
  }

  /**
   * Set system prompt
   */
  setSystemPrompt(prompt: string): this {
    this.config.systemPrompt = prompt;
    return this;
  }

  /**
   * Set model parameters
   */
  setModelParams(temperature?: number, maxTokens?: number): this {
    if (temperature !== undefined) this.config.temperature = temperature;
    if (maxTokens !== undefined) this.config.maxTokens = maxTokens;
    return this;
  }

  /**
   * Set priority and concurrency
   */
  setPriority(priority: number, maxConcurrentTasks?: number): this {
    this.config.priority = priority;
    if (maxConcurrentTasks !== undefined) {
      this.config.maxConcurrentTasks = maxConcurrentTasks;
    }
    return this;
  }

  /**
   * Set task confidence levels
   */
  setTaskConfidence(confidence: Partial<Record<TaskType, number>>): this {
    this.config.taskConfidence = confidence;
    return this;
  }

  /**
   * Set collaboration preferences
   */
  setCollaboration(
    preferredPartners: string[],
    canWorkAlone = true,
    requiresSupervision = false
  ): this {
    this.config.collaboration = {
      preferredPartners,
      canWorkAlone,
      requiresSupervision
    };
    return this;
  }

  /**
   * Set performance thresholds
   */
  setPerformance(
    maxResponseTime: number,
    minAccuracy: number,
    maxErrorRate: number
  ): this {
    this.config.performance = {
      maxResponseTime,
      minAccuracy,
      maxErrorRate
    };
    return this;
  }

  /**
   * Set custom prompts for specific tasks
   */
  setCustomPrompts(prompts: Partial<Record<TaskType, string>>): this {
    this.config.customPrompts = prompts;
    return this;
  }

  /**
   * Set agent tools (fix type issue)
   */
  setTools(tools: Tool[]): this {
    this.config.tools = tools;
    return this;
  }

  /**
   * Set model configuration
   */
  setModelConfig(config: {
    provider?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  }): this {
    if (config.temperature !== undefined) this.config.temperature = config.temperature;
    if (config.maxTokens !== undefined) this.config.maxTokens = config.maxTokens;
    // Store additional model config in metadata if needed
    if (!this.config.metadata) this.config.metadata = {};
    this.config.metadata.modelConfig = config;
    return this;
  }

  /**
   * Build the final configuration
   */
  build(): IBaseAgentConfig {
    const finalConfig = {
      ...DEFAULT_AGENT_CONFIG,
      ...this.config
    } as IBaseAgentConfig;

    this.validateConfig(finalConfig);
    return finalConfig;
  }

  /**
   * Make validateConfig method public
   */
  public validateConfig(config: IBaseAgentConfig): void {
    if (!config.name) {
      throw new Error('Agent name is required');
    }

    if (!config.type) {
      throw new Error('Agent type is required');
    }

    if (!config.description) {
      throw new Error('Agent description is required');
    }

    if (!config.availableTasks || config.availableTasks.length === 0) {
      throw new Error('Agent must have at least one available task');
    }

    if (!config.systemPrompt) {
      throw new Error('System prompt is required');
    }

    if (!config.specialization) {
      throw new Error('Agent specialization is required');
    }

    if (!config.role) {
      throw new Error('Agent role is required');
    }

    if (config.priority < 1 || config.priority > 10) {
      throw new Error('Priority must be between 1 and 10');
    }

    if (config.maxConcurrentTasks < 1) {
      throw new Error('Max concurrent tasks must be at least 1');
    }

    if (config.temperature < 0 || config.temperature > 2) {
      throw new Error('Temperature must be between 0 and 2');
    }

    if (config.maxTokens < 1) {
      throw new Error('Max tokens must be at least 1');
    }
  }
}

/**
 * Utility functions for agent configuration
 */
export class AgentConfigUtils {
  /**
   * Create a default configuration for an agent type
   */
  static createDefaultConfig(agentType: AgentType): Partial<IBaseAgentConfig> {
    return {
      type: agentType,
      ...DEFAULT_AGENT_CONFIG
    };
  }

  /**
   * Merge configurations with validation
   */
  static mergeConfigs(
    baseConfig: IBaseAgentConfig,
    overrides: Partial<IBaseAgentConfig>
  ): IBaseAgentConfig {
    const merged = {
      ...baseConfig,
      ...overrides,
      // Deep merge nested objects
      collaboration: {
        ...baseConfig.collaboration,
        ...overrides.collaboration
      },
      performance: {
        ...baseConfig.performance,
        ...overrides.performance
      },
      taskConfidence: {
        ...baseConfig.taskConfidence,
        ...overrides.taskConfidence
      },
      customPrompts: {
        ...baseConfig.customPrompts,
        ...overrides.customPrompts
      }
    };

    return merged;
  }

  /**
   * Validate agent configuration
   */
  static validateConfig(config: IBaseAgentConfig): boolean {
    try {
      new BaseAgentConfigBuilder().validateConfig(config);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get configuration summary
   */
  static getConfigSummary(config: IBaseAgentConfig): string {
    return `Agent: ${config.name} (${config.type})\n` +
           `Role: ${config.role}\n` +
           `Specialization: ${config.specialization}\n` +
           `Tasks: ${config.availableTasks.length}\n` +
           `Priority: ${config.priority}\n` +
           `Max Concurrent: ${config.maxConcurrentTasks}`;
  }

  /**
   * Export configuration to JSON
   */
  static exportConfig(config: IBaseAgentConfig): string {
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  static importConfig(jsonString: string): IBaseAgentConfig {
    try {
      const config = JSON.parse(jsonString) as IBaseAgentConfig;
      if (!this.validateConfig(config)) {
        throw new Error('Invalid configuration format');
      }
      return config;
    } catch (error) {
      throw new Error(`Failed to import configuration: ${error.message}`);
    }
  }
}