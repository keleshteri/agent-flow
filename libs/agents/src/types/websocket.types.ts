import { IChatMessage, IChatStreamResponse, ITypingIndicator } from './chat.types';
import { AgentType } from './agent.types';
import { ITaskProgress } from './task.types';
import { WebSocketEventType } from '../enums/websocket.enums';
import { TaskType } from '../enums/task.enums';

/**
 * Interface for WebSocket client information
 */
export interface IWebSocketClient {
  id: string;
  userId: string;
  sessionId: string;
  connectedAt: Date;
  lastActivity: Date;
  metadata: Record<string, any>;
}

/**
 * Interface for WebSocket message payload
 */
export interface IWebSocketMessage {
  event: WebSocketEventType;
  data: any;
  timestamp: Date;
  clientId?: string;
  sessionId?: string;
  userId?: string;
}

/**
 * Interface for message send event data
 */
export interface IMessageSendData {
  content: string;
  sessionId: string;
  agentType?: AgentType;
  taskType?: TaskType;
  attachments?: any[];
  metadata?: Record<string, any>;
}

/**
 * Interface for message receive event data
 */
export interface IMessageReceiveData {
  message: IChatMessage;
}

/**
 * Interface for message stream event data
 */
export interface IMessageStreamData {
  response: IChatStreamResponse;
}

/**
 * Interface for typing event data
 */
export interface ITypingEventData {
  indicator: ITypingIndicator;
}

/**
 * Interface for agent switch event data
 */
export interface IAgentSwitchData {
  sessionId: string;
  fromAgent?: AgentType;
  toAgent: AgentType;
  reason?: string;
  timestamp: Date;
}

/**
 * Interface for agent status event data
 */
export interface IAgentStatusData {
  agentType: AgentType;
  isAvailable: boolean;
  currentLoad: number;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Interface for task start event data
 */
export interface ITaskStartData {
  taskId: string;
  taskType: TaskType;
  agentType: AgentType;
  sessionId: string;
  estimatedDuration?: number;
  timestamp: Date;
}

/**
 * Interface for task progress event data
 */
export interface ITaskProgressData {
  progress: ITaskProgress;
}

/**
 * Interface for task complete event data
 */
export interface ITaskCompleteData {
  taskId: string;
  taskType: TaskType;
  agentType: AgentType;
  sessionId: string;
  result: any;
  duration: number;
  timestamp: Date;
}

/**
 * Interface for task error event data
 */
export interface ITaskErrorData {
  taskId: string;
  taskType: TaskType;
  agentType: AgentType;
  sessionId: string;
  error: string;
  timestamp: Date;
}

/**
 * Interface for session join event data
 */
export interface ISessionJoinData {
  sessionId: string;
  userId: string;
  clientId: string;
  timestamp: Date;
}

/**
 * Interface for session leave event data
 */
export interface ISessionLeaveData {
  sessionId: string;
  userId: string;
  clientId: string;
  duration: number;
  timestamp: Date;
}

/**
 * Interface for session update event data
 */
export interface ISessionUpdateData {
  sessionId: string;
  updates: Record<string, any>;
  timestamp: Date;
}

/**
 * Interface for error event data
 */
export interface IErrorEventData {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

/**
 * Interface for WebSocket gateway configuration
 */
export interface IWebSocketGatewayConfig {
  port?: number;
  cors?: {
    origin: string | string[];
    credentials: boolean;
  };
  maxConnections?: number;
  heartbeatInterval?: number;
  connectionTimeout?: number;
  messageRateLimit?: {
    max: number;
    windowMs: number;
  };
}

/**
 * Interface for WebSocket room management
 */
export interface IWebSocketRoom {
  id: string;
  name: string;
  clients: Set<string>;
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Type for WebSocket event handler
 */
export type WebSocketEventHandler<T = any> = (client: IWebSocketClient, data: T) => Promise<void> | void;

/**
 * Interface for WebSocket service
 */
export interface IWebSocketService {
  /**
   * Send message to specific client
   */
  sendToClient(clientId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Send message to all clients in a session
   */
  sendToSession(sessionId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Send message to all clients of a user
   */
  sendToUser(userId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Broadcast message to all connected clients
   */
  broadcast(message: IWebSocketMessage): Promise<void>;
  
  /**
   * Get connected clients
   */
  getConnectedClients(): IWebSocketClient[];
  
  /**
   * Get clients in a session
   */
  getSessionClients(sessionId: string): IWebSocketClient[];
  
  /**
   * Disconnect a client
   */
  disconnectClient(clientId: string): Promise<void>;
}