import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AgentsModule } from '../agents/agents.module';

/**
 * Chat Module
 * Provides real-time chat functionality with AI agents integration
 */
@Module({
  imports: [AgentsModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}