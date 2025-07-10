import { 
  IWebSocketClient,
  IWebSocketMessage,
  IWebSocketGatewayConfig,
  IWebSocketRoom,
  WebSocketEventHandler
} from '../types';
import { WebSocketEventType } from '../enums';

/**
 * Interface for WebSocket connection management
 */
export interface IWebSocketConnectionManager {
  /**
   * Handle new client connection
   */
  handleConnection(clientId: string, socket: any): Promise<IWebSocketClient>;
  
  /**
   * Handle client disconnection
   */
  handleDisconnection(clientId: string): Promise<void>;
  
  /**
   * Get connected client
   */
  getClient(clientId: string): Promise<IWebSocketClient | null>;
  
  /**
   * Get all connected clients
   */
  getAllClients(): Promise<IWebSocketClient[]>;
  
  /**
   * Get clients by user ID
   */
  getClientsByUser(userId: string): Promise<IWebSocketClient[]>;
  
  /**
   * Get clients by session ID
   */
  getClientsBySession(sessionId: string): Promise<IWebSocketClient[]>;
  
  /**
   * Update client information
   */
  updateClient(clientId: string, updates: Partial<IWebSocketClient>): Promise<void>;
  
  /**
   * Check if client is connected
   */
  isClientConnected(clientId: string): Promise<boolean>;
  
  /**
   * Get connection count
   */
  getConnectionCount(): Promise<number>;
  
  /**
   * Cleanup inactive connections
   */
  cleanupInactiveConnections(): Promise<void>;
}

/**
 * Interface for WebSocket room management
 */
export interface IWebSocketRoomManager {
  /**
   * Create a new room
   */
  createRoom(roomId: string, name: string, metadata?: Record<string, any>): Promise<IWebSocketRoom>;
  
  /**
   * Delete a room
   */
  deleteRoom(roomId: string): Promise<void>;
  
  /**
   * Get room by ID
   */
  getRoom(roomId: string): Promise<IWebSocketRoom | null>;
  
  /**
   * Get all rooms
   */
  getAllRooms(): Promise<IWebSocketRoom[]>;
  
  /**
   * Join client to room
   */
  joinRoom(clientId: string, roomId: string): Promise<void>;
  
  /**
   * Remove client from room
   */
  leaveRoom(clientId: string, roomId: string): Promise<void>;
  
  /**
   * Get room members
   */
  getRoomMembers(roomId: string): Promise<string[]>;
  
  /**
   * Get client rooms
   */
  getClientRooms(clientId: string): Promise<string[]>;
  
  /**
   * Send message to room
   */
  sendToRoom(roomId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Broadcast to all rooms
   */
  broadcastToAllRooms(message: IWebSocketMessage): Promise<void>;
}

/**
 * Interface for WebSocket message handling
 */
export interface IWebSocketMessageHandler {
  /**
   * Handle incoming message
   */
  handleMessage(clientId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Send message to client
   */
  sendToClient(clientId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Send message to multiple clients
   */
  sendToClients(clientIds: string[], message: IWebSocketMessage): Promise<void>;
  
  /**
   * Broadcast message to all clients
   */
  broadcast(message: IWebSocketMessage): Promise<void>;
  
  /**
   * Send message to user (all their connections)
   */
  sendToUser(userId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Send message to session (all clients in session)
   */
  sendToSession(sessionId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Queue message for delivery
   */
  queueMessage(clientId: string, message: IWebSocketMessage): Promise<void>;
  
  /**
   * Process message queue
   */
  processMessageQueue(): Promise<void>;
}

/**
 * Interface for WebSocket event handling
 */
export interface IWebSocketEventManager {
  /**
   * Register event handler
   */
  registerHandler(eventType: WebSocketEventType, handler: WebSocketEventHandler): void;
  
  /**
   * Unregister event handler
   */
  unregisterHandler(eventType: WebSocketEventType, handler: WebSocketEventHandler): void;
  
  /**
   * Emit event
   */
  emitEvent(eventType: WebSocketEventType, clientId: string, data: any): Promise<void>;
  
  /**
   * Get registered handlers
   */
  getHandlers(eventType: WebSocketEventType): WebSocketEventHandler[];
  
  /**
   * Clear all handlers
   */
  clearHandlers(): void;
  
  /**
   * Get event statistics
   */
  getEventStatistics(): Promise<Record<WebSocketEventType, number>>;
}

/**
 * Interface for WebSocket authentication
 */
export interface IWebSocketAuthentication {
  /**
   * Authenticate client connection
   */
  authenticateClient(token: string, socket: any): Promise<{ userId: string; sessionId?: string } | null>;
  
  /**
   * Validate client permissions
   */
  validatePermissions(clientId: string, action: string, resource?: string): Promise<boolean>;
  
  /**
   * Refresh client authentication
   */
  refreshAuthentication(clientId: string): Promise<boolean>;
  
  /**
   * Revoke client authentication
   */
  revokeAuthentication(clientId: string): Promise<void>;
  
  /**
   * Get client permissions
   */
  getClientPermissions(clientId: string): Promise<string[]>;
}

/**
 * Interface for WebSocket rate limiting
 */
export interface IWebSocketRateLimiter {
  /**
   * Check if client is rate limited
   */
  isRateLimited(clientId: string): Promise<boolean>;
  
  /**
   * Record client request
   */
  recordRequest(clientId: string): Promise<void>;
  
  /**
   * Get client request count
   */
  getRequestCount(clientId: string): Promise<number>;
  
  /**
   * Reset client rate limit
   */
  resetRateLimit(clientId: string): Promise<void>;
  
  /**
   * Configure rate limit for client
   */
  configureRateLimit(clientId: string, maxRequests: number, windowMs: number): Promise<void>;
  
  /**
   * Get rate limit statistics
   */
  getRateLimitStats(): Promise<Record<string, any>>;
}

/**
 * Interface for WebSocket monitoring
 */
export interface IWebSocketMonitoring {
  /**
   * Get connection statistics
   */
  getConnectionStats(): Promise<{
    totalConnections: number;
    activeConnections: number;
    connectionsPerSecond: number;
    averageConnectionDuration: number;
    totalMessages: number;
    messagesPerSecond: number;
    errorRate: number;
  }>;
  
  /**
   * Get client statistics
   */
  getClientStats(clientId: string): Promise<{
    connectionTime: Date;
    totalMessages: number;
    lastActivity: Date;
    averageResponseTime: number;
    errorCount: number;
  }>;
  
  /**
   * Get room statistics
   */
  getRoomStats(roomId: string): Promise<{
    memberCount: number;
    totalMessages: number;
    averageActivity: number;
    createdAt: Date;
  }>;
  
  /**
   * Get system health
   */
  getSystemHealth(): Promise<{
    healthy: boolean;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    activeConnections: number;
    errorRate: number;
  }>;
  
  /**
   * Subscribe to monitoring events
   */
  subscribeToMonitoring(callback: (stats: any) => void): () => void;
}

/**
 * Main WebSocket gateway interface
 */
export interface IWebSocketGateway extends 
  IWebSocketConnectionManager,
  IWebSocketRoomManager,
  IWebSocketMessageHandler,
  IWebSocketEventManager,
  IWebSocketAuthentication,
  IWebSocketRateLimiter,
  IWebSocketMonitoring {
  
  /**
   * Initialize WebSocket gateway
   */
  initialize(config: IWebSocketGatewayConfig): Promise<void>;
  
  /**
   * Start WebSocket server
   */
  start(): Promise<void>;
  
  /**
   * Stop WebSocket server
   */
  stop(): Promise<void>;
  
  /**
   * Restart WebSocket server
   */
  restart(): Promise<void>;
  
  /**
   * Check if server is running
   */
  isRunning(): boolean;
  
  /**
   * Get server configuration
   */
  getConfig(): IWebSocketGatewayConfig;
  
  /**
   * Update server configuration
   */
  updateConfig(config: Partial<IWebSocketGatewayConfig>): Promise<void>;
  
  /**
   * Handle server shutdown
   */
  shutdown(): Promise<void>;
}

/**
 * Interface for WebSocket middleware
 */
export interface IWebSocketMiddleware {
  /**
   * Process incoming connection
   */
  processConnection?(socket: any, next: (error?: any) => void): void;
  
  /**
   * Process incoming message
   */
  processMessage?(clientId: string, message: IWebSocketMessage, next: (error?: any) => void): void;
  
  /**
   * Process outgoing message
   */
  processOutgoingMessage?(clientId: string, message: IWebSocketMessage, next: (error?: any) => void): void;
  
  /**
   * Process disconnection
   */
  processDisconnection?(clientId: string, next: (error?: any) => void): void;
}

/**
 * Interface for WebSocket plugin system
 */
export interface IWebSocketPluginManager {
  /**
   * Register plugin
   */
  registerPlugin(name: string, plugin: IWebSocketPlugin): void;
  
  /**
   * Unregister plugin
   */
  unregisterPlugin(name: string): void;
  
  /**
   * Get plugin
   */
  getPlugin(name: string): IWebSocketPlugin | null;
  
  /**
   * Get all plugins
   */
  getAllPlugins(): Record<string, IWebSocketPlugin>;
  
  /**
   * Enable plugin
   */
  enablePlugin(name: string): void;
  
  /**
   * Disable plugin
   */
  disablePlugin(name: string): void;
}

/**
 * Interface for WebSocket plugins
 */
export interface IWebSocketPlugin {
  name: string;
  version: string;
  description: string;
  
  /**
   * Initialize plugin
   */
  initialize(gateway: IWebSocketGateway): Promise<void>;
  
  /**
   * Cleanup plugin
   */
  cleanup(): Promise<void>;
  
  /**
   * Get plugin configuration
   */
  getConfig(): Record<string, any>;
  
  /**
   * Update plugin configuration
   */
  updateConfig(config: Record<string, any>): void;
}