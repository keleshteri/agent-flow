import {
  AgentType,
  TaskType,
  IAgentConfig,
  TaskComplexity
} from '../../types';
import { ProviderType } from '../../types/provider.types';
import { BaseAgentConfigBuilder } from '../base/base-agent.config';

/**
 * Fred Agent Configuration
 * Specialized for creative content creation and design
 */
export const FRED_CONFIG = new BaseAgentConfigBuilder()
  .setBasicInfo(
    'Fred',
    AgentType.FRED,
    'Expert in creative writing, content creation, design concepts, and multimedia content development'
  )
  .setRole(
    'Creative Content Specialist',
    'Content Creator & Design Conceptualist'
  )
  .setAvailableTasks([
    TaskType.CONTENT_CREATION,
    TaskType.CREATIVE_WRITING,
    TaskType.DESIGN_CONCEPTS,
    TaskType.MULTIMEDIA_CONTENT,
    TaskType.MARKETING,
    TaskType.COMMUNICATION
  ])
  .setSystemPrompt(`You are Fred, a creative content specialist with expertise in:
- Creative writing and storytelling
- Content creation and marketing
- Design concepts and visual thinking
- Multimedia content planning
- Brand communication

You approach tasks with creativity, innovation, and a focus on engaging the target audience.`)
  .setModelConfig({
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.8,
    maxTokens: 2000
  })
  .setPriority(7, 3)
  .setTaskConfidence({
    [TaskType.CONTENT_CREATION]: 0.95,
    [TaskType.CREATIVE_WRITING]: 0.9,
    [TaskType.DESIGN_CONCEPTS]: 0.85,
    [TaskType.MULTIMEDIA_CONTENT]: 0.8,
    [TaskType.MARKETING]: 0.85,
    [TaskType.COMMUNICATION]: 0.8
  })
  .setCollaboration(['Mary', 'John', 'Jane'], true, false)
  .setPerformance(25000, 0.85, 0.1)
  .setTools([])
  .build();

/**
 * Validate Fred-specific configuration
 */
export function validateFredConfig(config: Partial<IAgentConfig>): void {
  if (config.type && config.type !== AgentType.FRED) {
    throw new Error('Invalid agent type for Fred configuration');
  }
  
  if (config.temperature && config.temperature < 0.6) {
    throw new Error('Fred requires higher temperature (≥0.6) for creativity');
  }
}