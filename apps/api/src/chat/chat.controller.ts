import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import {
  CreateMessageDto,
  CreateSessionDto,
  ChatMessageDto,
  ChatSessionDto,
} from './dto';

/**
 * Chat Controller
 * Handles HTTP endpoints for chat functionality
 */
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Create a new chat session
   */
  @Post('sessions')
  @ApiOperation({ summary: 'Create a new chat session' })
  @ApiResponse({
    status: 201,
    description: 'Chat session created successfully',
    type: ChatSessionDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createSession(@Body() createSessionDto: CreateSessionDto): Promise<ChatSessionDto> {
    return this.chatService.createSession(createSessionDto);
  }

  /**
   * Get user's chat sessions
   */
  @Get('sessions/user/:userId')
  @ApiOperation({ summary: 'Get all chat sessions for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User sessions retrieved successfully',
    type: [ChatSessionDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserSessions(@Param('userId') userId: string): Promise<ChatSessionDto[]> {
    return this.chatService.getUserSessions(userId);
  }

  /**
   * Get a specific chat session
   */
  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get a chat session by ID' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session retrieved successfully',
    type: ChatSessionDto,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('sessionId') sessionId: string): Promise<ChatSessionDto> {
    return this.chatService.getSession(sessionId);
  }

  /**
   * Delete a chat session
   */
  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a chat session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({ status: 204, description: 'Session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async deleteSession(@Param('sessionId') sessionId: string): Promise<void> {
    return this.chatService.deleteSession(sessionId);
  }

  /**
   * Update session status (activate/deactivate)
   */
  @Patch('sessions/:sessionId/status')
  @ApiOperation({ summary: 'Update session status' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session status updated successfully',
    type: ChatSessionDto,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async updateSessionStatus(
    @Param('sessionId') sessionId: string,
    @Body() body: { isActive: boolean }
  ): Promise<ChatSessionDto> {
    return this.chatService.updateSessionStatus(sessionId, body.isActive);
  }

  /**
   * Send a message in a chat session
   */
  @Post('messages')
  @ApiOperation({ summary: 'Send a message in a chat session' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: ChatMessageDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async sendMessage(@Body() createMessageDto: CreateMessageDto): Promise<ChatMessageDto> {
    return this.chatService.sendMessage(createMessageDto);
  }

  /**
   * Get messages for a chat session
   */
  @Get('sessions/:sessionId/messages')
  @ApiOperation({ summary: 'Get messages for a chat session' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of messages to return',
    example: 50,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of messages to skip',
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    type: [ChatMessageDto],
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSessionMessages(
    @Param('sessionId') sessionId: string,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0
  ): Promise<ChatMessageDto[]> {
    return this.chatService.getSessionMessages(sessionId, Number(limit), Number(offset));
  }
}