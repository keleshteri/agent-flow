import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto, CreateSessionDto } from './dto';

/**
 * WebSocket Gateway for real-time chat communication
 * Provides real-time messaging and typing indicators
 */
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<string, Socket>();
  private userSessions = new Map<string, Set<string>>(); // userId -> Set of sessionIds
  private sessionClients = new Map<string, Set<string>>(); // sessionId -> Set of clientIds
  private typingUsers = new Map<string, Set<string>>(); // sessionId -> Set of userIds

  constructor(private readonly chatService: ChatService) {}

  /**
   * Initialize WebSocket gateway
   */
  afterInit(server: Server) {
    this.logger.log('Chat WebSocket Gateway initialized');
  }

  /**
   * Handle client connection
   */
  handleConnection(client: Socket) {
    this.logger.log(`Chat client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Chat client disconnected: ${client.id}`);
    
    // Clean up client from all sessions
    this.sessionClients.forEach((clients, sessionId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.sessionClients.delete(sessionId);
        }
      }
    });

    // Clean up typing indicators
    this.cleanupTypingForClient(client.id);
    
    this.connectedClients.delete(client.id);
  }

  /**
   * Join a chat session room
   */
  @SubscribeMessage('joinSession')
  handleJoinSession(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { sessionId, userId } = data;
    
    // Join the session room
    client.join(sessionId);
    
    // Track client in session
    if (!this.sessionClients.has(sessionId)) {
      this.sessionClients.set(sessionId, new Set());
    }
    this.sessionClients.get(sessionId)!.add(client.id);
    
    // Track user sessions
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);
    
    this.logger.log(`Client ${client.id} joined session ${sessionId}`);
    
    // Notify other clients in the session
    client.to(sessionId).emit('userJoined', {
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
    });
    
    return { success: true, sessionId };
  }

  /**
   * Leave a chat session room
   */
  @SubscribeMessage('leaveSession')
  handleLeaveSession(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { sessionId, userId } = data;
    
    // Leave the session room
    client.leave(sessionId);
    
    // Remove client from session tracking
    const sessionClients = this.sessionClients.get(sessionId);
    if (sessionClients) {
      sessionClients.delete(client.id);
      if (sessionClients.size === 0) {
        this.sessionClients.delete(sessionId);
      }
    }
    
    // Remove from user sessions
    const userSessionSet = this.userSessions.get(userId);
    if (userSessionSet) {
      userSessionSet.delete(sessionId);
      if (userSessionSet.size === 0) {
        this.userSessions.delete(userId);
      }
    }
    
    // Clean up typing indicators
    this.removeTypingUser(sessionId, userId);
    
    this.logger.log(`Client ${client.id} left session ${sessionId}`);
    
    // Notify other clients in the session
    client.to(sessionId).emit('userLeft', {
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
    });
    
    return { success: true, sessionId };
  }

  /**
   * Create a new chat session via WebSocket
   */
  @SubscribeMessage('createSession')
  async handleCreateSession(
    @MessageBody() data: CreateSessionDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const session = await this.chatService.createSession(data);
      
      this.logger.log(`Session created via WebSocket: ${session.id}`);
      
      return {
        success: true,
        session,
      };
    } catch (error) {
      this.logger.error(`Failed to create session via WebSocket:`, error);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send a message via WebSocket
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto & { clientMessageId?: string },
    @ConnectedSocket() client: Socket
  ) {
    const clientMessageId = data.clientMessageId || `client_msg_${Date.now()}`;
    
    try {
      // Send the message
      const message = await this.chatService.sendMessage(data);
      
      this.logger.log(`Message sent via WebSocket in session ${data.sessionId}`);
      
      // Broadcast message to all clients in the session
      this.server.to(data.sessionId).emit('messageReceived', {
        message,
        clientMessageId,
        timestamp: new Date().toISOString(),
      });
      
      // Remove typing indicator for the sender
      this.removeTypingUser(data.sessionId, data.userId);
      
      return {
        success: true,
        message,
        clientMessageId,
      };
    } catch (error) {
      this.logger.error(`Failed to send message via WebSocket:`, error);
      
      // Notify the sender about the error
      client.emit('messageError', {
        clientMessageId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      
      return {
        success: false,
        clientMessageId,
        error: error.message,
      };
    }
  }

  /**
   * Handle typing indicators
   */
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { sessionId: string; userId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket
  ) {
    const { sessionId, userId, isTyping } = data;
    
    if (isTyping) {
      this.addTypingUser(sessionId, userId);
    } else {
      this.removeTypingUser(sessionId, userId);
    }
    
    // Broadcast typing status to other clients in the session
    client.to(sessionId).emit('typingUpdate', {
      sessionId,
      userId,
      isTyping,
      timestamp: new Date().toISOString(),
    });
    
    return { success: true };
  }

  /**
   * Get typing users for a session
   */
  @SubscribeMessage('getTypingUsers')
  handleGetTypingUsers(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket
  ) {
    const typingUsers = Array.from(this.typingUsers.get(data.sessionId) || []);
    
    return {
      success: true,
      sessionId: data.sessionId,
      typingUsers,
    };
  }

  /**
   * Get active users in a session
   */
  @SubscribeMessage('getActiveUsers')
  handleGetActiveUsers(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket
  ) {
    const sessionClients = this.sessionClients.get(data.sessionId) || new Set();
    const activeUsers = Array.from(sessionClients).length;
    
    return {
      success: true,
      sessionId: data.sessionId,
      activeUsers,
    };
  }

  /**
   * Broadcast agent response to session
   */
  broadcastAgentResponse(sessionId: string, message: any) {
    this.server.to(sessionId).emit('agentResponse', {
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Broadcast agent typing status
   */
  broadcastAgentTyping(sessionId: string, isTyping: boolean, agentType?: string) {
    this.server.to(sessionId).emit('agentTyping', {
      sessionId,
      agentType,
      isTyping,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Add typing user to session
   */
  private addTypingUser(sessionId: string, userId: string) {
    if (!this.typingUsers.has(sessionId)) {
      this.typingUsers.set(sessionId, new Set());
    }
    this.typingUsers.get(sessionId)!.add(userId);
  }

  /**
   * Remove typing user from session
   */
  private removeTypingUser(sessionId: string, userId: string) {
    const typingSet = this.typingUsers.get(sessionId);
    if (typingSet) {
      typingSet.delete(userId);
      if (typingSet.size === 0) {
        this.typingUsers.delete(sessionId);
      }
    }
  }

  /**
   * Clean up typing indicators for disconnected client
   */
  private cleanupTypingForClient(clientId: string) {
    // Find sessions where this client was active
    this.sessionClients.forEach((clients, sessionId) => {
      if (clients.has(clientId)) {
        // Remove typing indicators for all users in this session
        // (simplified approach - in production, you'd track client-user mapping)
        this.typingUsers.delete(sessionId);
      }
    });
  }
}