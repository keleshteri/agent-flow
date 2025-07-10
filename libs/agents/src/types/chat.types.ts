import { AgentType } from './agent.types';
import { TaskType } from './task.types';

/**
 * Enum for message types
 */
export enum MessageType {
  USER = 'user',
  AGENT = 'agent',
  SYSTEM = 'system',
  TOOL_CALL = 'tool_call',
  TOOL_RESULT = 'tool_result',
  ERROR = 'error',
}

/**
 * Enum for message status
 */
export enum MessageStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Interface for chat message
 */
export interface IChatMessage {
  id: string;
  sessionId: string;
  type: MessageType;
  content: string;
  agentType?: AgentType;
  taskType?: TaskType;
  status: MessageStatus;
  metadata: Record<string, any>;
  attachments?: IChatAttachment[];
  toolCalls?: IToolCall[];
  parentMessageId?: string;
  timestamp: Date;
  userId: string;
}

/**
 * Interface for chat attachments
 */
export interface IChatAttachment {
  id: string;
  name: string;
  type: 'file' | 'image' | 'document' | 'url';
  url: string;
  size?: number;
  mimeType?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for tool calls in messages
 */
export interface IToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
  result?: any;
  error?: string;
  timestamp: Date;
}

/**
 * Interface for chat session
 */
export interface IChatSession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  currentAgentType?: AgentType;
  currentTaskType?: TaskType;
  isActive: boolean;
  messages: IChatMessage[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
}

/**
 * Interface for chat context
 */
export interface IChatContext {
  sessionId: string;
  userId: string;
  currentMessage: IChatMessage;
  conversationHistory: IChatMessage[];
  activeAgents: AgentType[];
  metadata: Record<string, any>;
}

/**
 * Interface for chat response
 */
export interface IChatResponse {
  messageId: string;
  sessionId: string;
  agentType: AgentType;
  content: string;
  status: MessageStatus;
  toolCalls?: IToolCall[];
  suggestions?: string[];
  metadata: Record<string, any>;
  timestamp: Date;
}

/**
 * Interface for chat streaming response
 */
export interface IChatStreamResponse {
  messageId: string;
  sessionId: string;
  agentType: AgentType;
  chunk: string;
  isComplete: boolean;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Interface for chat configuration
 */
export interface IChatConfig {
  maxMessages: number;
  maxMessageLength: number;
  allowedFileTypes: string[];
  maxFileSize: number;
  sessionTimeout: number; // in minutes
  enableStreaming: boolean;
  enableToolCalls: boolean;
  defaultAgentType: AgentType;
}

/**
 * Interface for chat statistics
 */
export interface IChatStats {
  sessionId: string;
  totalMessages: number;
  userMessages: number;
  agentMessages: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  activeDuration: number; // in minutes
  lastActivity: Date;
}

/**
 * Type for chat event handlers
 */
export type ChatEventHandler = (event: IChatEvent) => void;

/**
 * Interface for chat events
 */
export interface IChatEvent {
  type: 'message' | 'typing' | 'agent_switch' | 'task_start' | 'task_complete' | 'error';
  sessionId: string;
  data: any;
  timestamp: Date;
}

/**
 * Interface for typing indicator
 */
export interface ITypingIndicator {
  sessionId: string;
  agentType: AgentType;
  isTyping: boolean;
  timestamp: Date;
}