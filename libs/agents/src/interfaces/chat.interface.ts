import { 
  IChatMessage, 
  IChatSession, 
  IChatContext, 
  IChatResponse, 
  IChatStreamResponse,
  IChatConfig,
  IChatStats,
  MessageType,
  MessageStatus
} from '../types';
import { AgentType, TaskType } from '../types';

/**
 * Interface for chat message processing
 */
export interface IChatMessageProcessor {
  /**
   * Process incoming user message
   */
  processUserMessage(message: IChatMessage, context: IChatContext): Promise<IChatResponse>;
  
  /**
   * Process agent response
   */
  processAgentResponse(response: IChatResponse, context: IChatContext): Promise<IChatMessage>;
  
  /**
   * Validate message content
   */
  validateMessage(message: IChatMessage): Promise<boolean>;
  
  /**
   * Filter message content
   */
  filterMessage(message: IChatMessage): Promise<IChatMessage>;
  
  /**
   * Extract intent from message
   */
  extractIntent(message: IChatMessage): Promise<string>;
  
  /**
   * Extract entities from message
   */
  extractEntities(message: IChatMessage): Promise<Record<string, any>>;
}

/**
 * Interface for chat session management
 */
export interface IChatSessionManager {
  /**
   * Create a new chat session
   */
  createSession(userId: string, config?: Partial<IChatConfig>): Promise<IChatSession>;
  
  /**
   * Get session by ID
   */
  getSession(sessionId: string): Promise<IChatSession | null>;
  
  /**
   * Get sessions by user ID
   */
  getSessionsByUser(userId: string): Promise<IChatSession[]>;
  
  /**
   * Update session
   */
  updateSession(sessionId: string, updates: Partial<IChatSession>): Promise<void>;
  
  /**
   * Delete session
   */
  deleteSession(sessionId: string): Promise<void>;
  
  /**
   * Add message to session
   */
  addMessage(sessionId: string, message: IChatMessage): Promise<void>;
  
  /**
   * Get session messages
   */
  getSessionMessages(sessionId: string, limit?: number, offset?: number): Promise<IChatMessage[]>;
  
  /**
   * Clear session messages
   */
  clearSessionMessages(sessionId: string): Promise<void>;
  
  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string): Promise<IChatStats>;
  
  /**
   * Archive session
   */
  archiveSession(sessionId: string): Promise<void>;
  
  /**
   * Restore archived session
   */
  restoreSession(sessionId: string): Promise<void>;
}

/**
 * Interface for chat history management
 */
export interface IChatHistoryManager {
  /**
   * Save message to history
   */
  saveMessage(message: IChatMessage): Promise<void>;
  
  /**
   * Get message by ID
   */
  getMessage(messageId: string): Promise<IChatMessage | null>;
  
  /**
   * Update message
   */
  updateMessage(messageId: string, updates: Partial<IChatMessage>): Promise<void>;
  
  /**
   * Delete message
   */
  deleteMessage(messageId: string): Promise<void>;
  
  /**
   * Search messages
   */
  searchMessages(query: string, filters?: Record<string, any>): Promise<IChatMessage[]>;
  
  /**
   * Get conversation history
   */
  getConversationHistory(sessionId: string, limit?: number): Promise<IChatMessage[]>;
  
  /**
   * Export conversation history
   */
  exportConversationHistory(sessionId: string, format: 'json' | 'csv' | 'txt'): Promise<string>;
  
  /**
   * Get message statistics
   */
  getMessageStatistics(timeRange?: string): Promise<Record<string, number>>;
}

/**
 * Interface for chat streaming
 */
export interface IChatStreaming {
  /**
   * Start streaming response
   */
  startStream(sessionId: string, messageId: string): Promise<void>;
  
  /**
   * Send stream chunk
   */
  sendStreamChunk(response: IChatStreamResponse): Promise<void>;
  
  /**
   * End streaming response
   */
  endStream(sessionId: string, messageId: string): Promise<void>;
  
  /**
   * Subscribe to stream events
   */
  subscribeToStream(sessionId: string, callback: (response: IChatStreamResponse) => void): () => void;
  
  /**
   * Check if streaming is active
   */
  isStreamingActive(sessionId: string): boolean;
}

/**
 * Interface for chat agent integration
 */
export interface IChatAgentIntegration {
  /**
   * Route message to appropriate agent
   */
  routeToAgent(message: IChatMessage, context: IChatContext): Promise<AgentType>;
  
  /**
   * Switch to different agent
   */
  switchAgent(sessionId: string, newAgentType: AgentType, reason?: string): Promise<void>;
  
  /**
   * Get current agent for session
   */
  getCurrentAgent(sessionId: string): Promise<AgentType | null>;
  
  /**
   * Get available agents for task
   */
  getAvailableAgents(taskType: TaskType): Promise<AgentType[]>;
  
  /**
   * Execute task with agent
   */
  executeTaskWithAgent(agentType: AgentType, message: IChatMessage, context: IChatContext): Promise<IChatResponse>;
}

/**
 * Interface for chat analytics
 */
export interface IChatAnalytics {
  /**
   * Track user interaction
   */
  trackInteraction(sessionId: string, interaction: Record<string, any>): Promise<void>;
  
  /**
   * Get user engagement metrics
   */
  getUserEngagementMetrics(userId: string): Promise<Record<string, number>>;
  
  /**
   * Get conversation analytics
   */
  getConversationAnalytics(sessionId: string): Promise<Record<string, any>>;
  
  /**
   * Get agent performance metrics
   */
  getAgentPerformanceMetrics(agentType: AgentType): Promise<Record<string, number>>;
  
  /**
   * Get popular topics
   */
  getPopularTopics(timeRange?: string): Promise<Array<{ topic: string; count: number }>>;
  
  /**
   * Get user satisfaction scores
   */
  getUserSatisfactionScores(timeRange?: string): Promise<Record<string, number>>;
  
  /**
   * Generate analytics report
   */
  generateAnalyticsReport(timeRange: string, format: 'json' | 'csv'): Promise<string>;
}

/**
 * Interface for chat moderation
 */
export interface IChatModeration {
  /**
   * Moderate message content
   */
  moderateMessage(message: IChatMessage): Promise<{ approved: boolean; reason?: string }>;
  
  /**
   * Check for inappropriate content
   */
  checkInappropriateContent(content: string): Promise<boolean>;
  
  /**
   * Filter profanity
   */
  filterProfanity(content: string): Promise<string>;
  
  /**
   * Detect spam
   */
  detectSpam(message: IChatMessage): Promise<boolean>;
  
  /**
   * Rate limit user
   */
  checkRateLimit(userId: string): Promise<boolean>;
  
  /**
   * Block user
   */
  blockUser(userId: string, reason: string): Promise<void>;
  
  /**
   * Unblock user
   */
  unblockUser(userId: string): Promise<void>;
  
  /**
   * Get moderation statistics
   */
  getModerationStats(): Promise<Record<string, number>>;
}

/**
 * Main chat service interface
 */
export interface IChatService extends 
  IChatMessageProcessor,
  IChatSessionManager,
  IChatHistoryManager,
  IChatStreaming,
  IChatAgentIntegration,
  IChatAnalytics,
  IChatModeration {
  
  /**
   * Initialize chat service
   */
  initialize(config: IChatConfig): Promise<void>;
  
  /**
   * Send message
   */
  sendMessage(sessionId: string, content: string, userId: string, metadata?: Record<string, any>): Promise<IChatResponse>;
  
  /**
   * Send message with streaming
   */
  sendMessageStream(sessionId: string, content: string, userId: string, metadata?: Record<string, any>): AsyncIterable<IChatStreamResponse>;
  
  /**
   * Get chat configuration
   */
  getConfig(): IChatConfig;
  
  /**
   * Update chat configuration
   */
  updateConfig(config: Partial<IChatConfig>): Promise<void>;
  
  /**
   * Get service health status
   */
  getHealthStatus(): Promise<{ healthy: boolean; details: Record<string, any> }>;
  
  /**
   * Shutdown chat service
   */
  shutdown(): Promise<void>;
}