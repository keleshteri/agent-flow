// Core exports - explicit exports to avoid conflicts
export * from './interfaces';

// Export specific types to avoid conflicts
export {
  AgentType,
  IAgentConfig,
  IAgentContext,
  IAgentResponse,
  IAgent,
  IAgentCapabilities
} from './types/agent.types';

export {
  ITaskInput,
  ITaskOutput,
  ITaskDefinition,
  ITaskRequest,
  ITaskResult,
  ITaskProgress,
  ITask,
  TaskValidator,
  TaskExecutor
} from './types/task.types';

export {
  IProvider,
  IProviderConfig,
  IProviderCapabilities,
  IProviderHealth,
  IProviderUsage,
  ProviderConfig,
  ProviderType
} from './types/provider.types';

// Export enums
export {
  TaskType,
  TaskStatus,
  TaskPriority,
  TaskComplexity
} from './enums/task.enums';

export {
  WebSocketEventType
} from './enums/websocket.enums';

// Agent exports
export * from './agents';

// Agent implementations
export * from './agents/mary';
export * from './agents/john';
export * from './agents/fred';
export * from './agents/jane';
export * from './agents/master-assistant';