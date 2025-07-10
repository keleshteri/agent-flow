import { AgentType, TaskType } from '../../types';
import { IBaseAgentConfig } from '../base/base-agent.interface';
import { BaseAgentConfigBuilder } from '../base/base-agent.config';

/**
 * Master Assistant Agent Configuration
 * Specialized for system coordination and task management
 */
export const MASTER_ASSISTANT_CONFIG: IBaseAgentConfig = new BaseAgentConfigBuilder()
  .setBasicInfo(
    'Master Assistant',
    AgentType.MASTER_ASSISTANT,
    'The primary coordinator and entry point for the agent system. Handles task routing, agent coordination, and high-level decision making.'
  )
  .setRole(
    'System Coordination and Task Management',
    'Master Coordinator'
  )
  .setAvailableTasks([
    TaskType.GENERAL_ASSISTANCE,
    TaskType.TASK_COORDINATION,
    TaskType.AGENT_ROUTING,
    TaskType.SYSTEM_MANAGEMENT,
    TaskType.DECISION_MAKING
  ])
  .setSystemPrompt(`
You are the Master Assistant, the primary coordinator of an advanced multi-agent system. Your role is to:

1. **System Coordination**: Orchestrate interactions between specialized agents
2. **Task Routing**: Analyze requests and route them to the most appropriate agents
3. **Decision Making**: Make high-level strategic decisions about task execution
4. **System Management**: Monitor system health and optimize performance
5. **User Interface**: Serve as the primary interface between users and the agent ecosystem

**Core Responsibilities:**
- Understand user requests and determine the best approach
- Route tasks to specialized agents (Mary for data analysis, John for research, etc.)
- Coordinate multi-agent workflows for complex tasks
- Provide system status and performance insights
- Make executive decisions when conflicts arise
- Ensure optimal resource utilization across the system

**Available Specialized Agents:**
- **Mary**: Data Analysis & Statistics Expert
- **John**: Research & Information Specialist
- **Fred**: Creative Writing & Content Creator
- **Jane**: Technical Support & Problem Solver
- **Sarah**: Project Management & Organization
- **Bob**: Customer Service & Communication

**Decision Framework:**
1. Analyze the request complexity and scope
2. Identify required expertise and capabilities
3. Consider current system load and agent availability
4. Route to appropriate agent(s) or handle directly
5. Monitor execution and provide coordination as needed

**Communication Style:**
- Professional yet approachable
- Clear and concise explanations
- Strategic thinking with practical implementation
- Proactive in suggesting optimizations
- Transparent about system capabilities and limitations

Always consider the bigger picture while ensuring efficient task execution.
  `)
  .setModelParams(0.7, 2000)
  .setPriority(10, 5) // Highest priority, can handle multiple concurrent tasks
  .setTaskConfidence({
    [TaskType.GENERAL_ASSISTANCE]: 0.95,
    [TaskType.TASK_COORDINATION]: 0.9,
    [TaskType.AGENT_ROUTING]: 0.9,
    [TaskType.SYSTEM_MANAGEMENT]: 0.85,
    [TaskType.DECISION_MAKING]: 0.8
  })
  .setCollaboration(
    ['all'], // Can collaborate with all agents
    true, // Can work alone
    false // Does not require supervision
  )
  .setPerformance(
    30000, // 30 seconds max response time
    0.9, // 90% minimum accuracy
    0.05 // 5% maximum error rate
  )
  // Tools will be configured at runtime
  .build();

/**
 * Master Assistant specific configuration options
 */
export const MASTER_ASSISTANT_SETTINGS = {
  // Routing preferences
  routing: {
    defaultTimeout: 30000, // 30 seconds
    maxRetries: 3,
    fallbackStrategy: 'self-handle', // or 'queue', 'reject'
    loadBalancing: true
  },
  
  // Coordination settings
  coordination: {
    maxConcurrentWorkflows: 10,
    workflowTimeout: 300000, // 5 minutes
    checkpointInterval: 30000, // 30 seconds
    enableAutoRecovery: true
  },
  
  // System monitoring
  monitoring: {
    healthCheckInterval: 60000, // 1 minute
    performanceMetricsRetention: 86400000, // 24 hours
    alertThresholds: {
      errorRate: 0.1, // 10%
      responseTime: 45000, // 45 seconds
      systemLoad: 0.8 // 80%
    }
  },
  
  // Decision making
  decisionMaking: {
    confidenceThreshold: 0.7,
    requireConsensus: false,
    escalationRules: {
      highComplexity: 'human-review',
      systemCritical: 'immediate-alert',
      resourceConstrained: 'load-balance'
    }
  },
  
  // Agent recommendations
  agentMapping: {
    [TaskType.DATA_ANALYSIS]: [AgentType.MARY],
    [TaskType.RESEARCH]: [AgentType.JOHN],
    [TaskType.CREATIVE_WRITING]: [AgentType.FRED],
    [TaskType.TECHNICAL_SUPPORT]: [AgentType.JANE],
    [TaskType.PROJECT_MANAGEMENT]: [AgentType.SARAH],
    [TaskType.CUSTOMER_SERVICE]: [AgentType.BOB]
  },
  
  // Learning and adaptation
  learning: {
    enablePerformanceLearning: true,
    adaptRoutingBasedOnSuccess: true,
    updateRecommendationsFrequency: 3600000, // 1 hour
    minSampleSizeForLearning: 10
  }
};

/**
 * Validation rules specific to Master Assistant
 */
export const MASTER_ASSISTANT_VALIDATION = {
  /**
   * Validate Master Assistant specific configuration
   */
  validateConfig(config: IBaseAgentConfig): boolean {
    // Must be Master Assistant type
    if (config.type !== AgentType.MASTER_ASSISTANT) {
      return false;
    }
    
    // Must support coordination tasks
    const requiredTasks = [
      TaskType.GENERAL_ASSISTANCE,
      TaskType.TASK_COORDINATION,
      TaskType.AGENT_ROUTING
    ];
    
    const hasRequiredTasks = requiredTasks.every(task => 
      config.availableTasks.includes(task)
    );
    
    if (!hasRequiredTasks) {
      return false;
    }
    
    // Must have high priority
    if (config.priority < 8) {
      return false;
    }
    
    // Must support multiple concurrent tasks
    if (config.maxConcurrentTasks < 3) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Get configuration recommendations
   */
  getRecommendations(config: IBaseAgentConfig): string[] {
    const recommendations: string[] = [];
    
    if (config.priority < 10) {
      recommendations.push('Consider setting priority to 10 for optimal coordination');
    }
    
    if (config.maxConcurrentTasks < 5) {
      recommendations.push('Increase maxConcurrentTasks to 5+ for better throughput');
    }
    
    if (config.temperature > 0.8) {
      recommendations.push('Lower temperature (≤0.8) recommended for consistent coordination');
    }
    
    return recommendations;
  }
};

/**
 * Factory function to create Master Assistant configuration
 */
export function createMasterAssistantConfig(
  overrides?: Partial<IBaseAgentConfig>
): IBaseAgentConfig {
  if (overrides) {
    return {
      ...MASTER_ASSISTANT_CONFIG,
      ...overrides,
      // Ensure critical properties are not overridden
      type: AgentType.MASTER_ASSISTANT,
      availableTasks: [
        ...MASTER_ASSISTANT_CONFIG.availableTasks,
        ...(overrides.availableTasks || [])
      ]
    };
  }
  
  return { ...MASTER_ASSISTANT_CONFIG };
}