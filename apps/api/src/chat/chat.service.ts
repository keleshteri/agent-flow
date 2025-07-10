import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { AgentType, TaskType } from '@agent-flow/agents';
import { AgentsService } from '../agents/agents.service';
import { CreateMessageDto, CreateSessionDto, ChatMessageDto, ChatSessionDto, MessageType, MessageStatus } from './dto';

// Define interfaces locally since they're not fully exported
interface IChatMessage {
  id: string;
  sessionId: string;
  type: MessageType;
  content: string;
  agentType?: AgentType;
  taskType?: TaskType;
  status: MessageStatus;
  metadata: Record<string, any>;
  attachments?: any[];
  toolCalls?: any[];
  parentMessageId?: string;
  timestamp: Date;
  userId: string;
}

interface IChatSession {
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
}

/**
 * Chat Service
 * Handles chat sessions, messages, and agent integration
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private sessions = new Map<string, IChatSession>();
  private messages = new Map<string, IChatMessage>();

  constructor(private readonly agentsService: AgentsService) {}

  /**
   * Create a new chat session
   */
  async createSession(createSessionDto: CreateSessionDto): Promise<ChatSessionDto> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: IChatSession = {
      id: sessionId,
      userId: createSessionDto.userId,
      title: createSessionDto.title || 'New Chat Session',
      description: createSessionDto.description,
      isActive: true,
      messages: [],
      metadata: createSessionDto.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    this.logger.log(`Created new chat session: ${sessionId}`);

    return this.mapSessionToDto(session);
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<ChatSessionDto> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Session not found: ${sessionId}`);
    }
    return this.mapSessionToDto(session);
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<ChatSessionDto[]> {
    const userSessions = Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return userSessions.map(session => this.mapSessionToDto(session));
  }

  /**
   * Send a message in a chat session
   */
  async sendMessage(createMessageDto: CreateMessageDto): Promise<ChatMessageDto> {
    const session = this.sessions.get(createMessageDto.sessionId);
    if (!session) {
      throw new NotFoundException(`Session not found: ${createMessageDto.sessionId}`);
    }

    if (!session.isActive) {
      throw new BadRequestException('Cannot send message to inactive session');
    }

    // Create user message
    const userMessage = await this.createUserMessage(createMessageDto);
    
    // Add to session and storage
    session.messages.push(userMessage);
    this.messages.set(userMessage.id, userMessage);
    session.updatedAt = new Date();

    this.logger.log(`User message sent in session ${createMessageDto.sessionId}`);

    // Process message with agents and get response
    const agentResponse = await this.processMessageWithAgent(userMessage, session);
    
    if (agentResponse) {
      session.messages.push(agentResponse);
      this.messages.set(agentResponse.id, agentResponse);
      session.updatedAt = new Date();
    }

    return this.mapMessageToDto(userMessage);
  }

  /**
   * Get messages for a session
   */
  async getSessionMessages(sessionId: string, limit = 50, offset = 0): Promise<ChatMessageDto[]> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Session not found: ${sessionId}`);
    }

    const messages = session.messages
      .slice(offset, offset + limit)
      .map(message => this.mapMessageToDto(message));

    return messages;
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Session not found: ${sessionId}`);
    }

    // Remove messages from storage
    session.messages.forEach(message => {
      this.messages.delete(message.id);
    });

    // Remove session
    this.sessions.delete(sessionId);
    this.logger.log(`Deleted session: ${sessionId}`);
  }

  /**
   * Update session status
   */
  async updateSessionStatus(sessionId: string, isActive: boolean): Promise<ChatSessionDto> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Session not found: ${sessionId}`);
    }

    session.isActive = isActive;
    session.updatedAt = new Date();

    this.logger.log(`Updated session ${sessionId} status to ${isActive ? 'active' : 'inactive'}`);
    return this.mapSessionToDto(session);
  }

  /**
   * Create user message from DTO
   */
  private async createUserMessage(createMessageDto: CreateMessageDto): Promise<IChatMessage> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: messageId,
      sessionId: createMessageDto.sessionId,
      type: MessageType.USER,
      content: createMessageDto.content,
      status: MessageStatus.DELIVERED,
      metadata: createMessageDto.metadata || {},
      timestamp: new Date(),
      userId: createMessageDto.userId,
    };
  }

  /**
   * Process message with appropriate agent
   */
  private async processMessageWithAgent(
    userMessage: IChatMessage, 
    session: IChatSession
  ): Promise<IChatMessage | null> {
    try {
      // Determine appropriate agent and task type
      const { agentType, taskType } = await this.determineAgentAndTask(userMessage.content);
      
      // Update session with current agent and task
      session.currentAgentType = agentType;
      session.currentTaskType = taskType;

      // Execute task with agent
      const taskResult = await this.agentsService.executeTask({
        type: taskType,
        description: userMessage.content,
        context: {
          metadata: {
            sessionId: session.id,
            messageId: userMessage.id,
            userId: userMessage.userId,
          },
        },
      });

      // Create agent response message
      const agentMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const agentMessage: IChatMessage = {
        id: agentMessageId,
        sessionId: session.id,
        type: MessageType.AGENT,
        content: taskResult.output?.result || 'Task completed successfully',
        agentType,
        taskType,
        status: MessageStatus.DELIVERED,
        metadata: {
          taskId: taskResult.taskId,
          executionTime: taskResult.output?.executionTime || 0,
          agentUsed: agentType,
          taskStatus: taskResult.status,
        },
        parentMessageId: userMessage.id,
        timestamp: new Date(),
        userId: 'system',
      };

      this.logger.log(`Agent ${agentType} processed message in session ${session.id}`);
      return agentMessage;
    } catch (error) {
      this.logger.error(`Failed to process message with agent:`, error);
      
      // Create error response
      const errorMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: errorMessageId,
        sessionId: session.id,
        type: MessageType.SYSTEM,
        content: 'I apologize, but I encountered an error processing your message. Please try again.',
        status: MessageStatus.ERROR,
        metadata: {
          error: error.message,
          errorType: 'agent_processing_error',
        },
        parentMessageId: userMessage.id,
        timestamp: new Date(),
        userId: 'system',
      };
    }
  }

  /**
   * Determine appropriate agent and task type based on message content
   */
  private async determineAgentAndTask(content: string): Promise<{ agentType: AgentType; taskType: TaskType }> {
    const lowerContent = content.toLowerCase();
    
    // Simple keyword-based routing (can be enhanced with ML)
    if (lowerContent.includes('data') || lowerContent.includes('analysis') || lowerContent.includes('chart')) {
      return { agentType: AgentType.MARY, taskType: TaskType.DATA_ANALYSIS };
    }
    
    if (lowerContent.includes('research') || lowerContent.includes('information') || lowerContent.includes('find')) {
      return { agentType: AgentType.JOHN, taskType: TaskType.RESEARCH };
    }
    
    if (lowerContent.includes('write') || lowerContent.includes('create') || lowerContent.includes('content')) {
      return { agentType: AgentType.FRED, taskType: TaskType.CONTENT_CREATION };
    }
    
    if (lowerContent.includes('code') || lowerContent.includes('implement') || lowerContent.includes('develop')) {
      return { agentType: AgentType.JANE, taskType: TaskType.SOFTWARE_DEVELOPMENT };
    }
    
    // Default to research for general queries
    return { agentType: AgentType.JOHN, taskType: TaskType.RESEARCH };
  }

  /**
   * Map session entity to DTO
   */
  private mapSessionToDto(session: IChatSession): ChatSessionDto {
    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      description: session.description,
      currentAgentType: session.currentAgentType,
      currentTaskType: session.currentTaskType,
      isActive: session.isActive,
      messages: session.messages.map(message => this.mapMessageToDto(message)),
      metadata: session.metadata,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  /**
   * Map message entity to DTO
   */
  private mapMessageToDto(message: IChatMessage): ChatMessageDto {
    return {
      id: message.id,
      sessionId: message.sessionId,
      type: message.type,
      content: message.content,
      agentType: message.agentType,
      taskType: message.taskType,
      status: message.status,
      metadata: message.metadata,
      attachments: message.attachments,
      toolCalls: message.toolCalls,
      parentMessageId: message.parentMessageId,
      timestamp: message.timestamp,
      userId: message.userId,
    };
  }
}