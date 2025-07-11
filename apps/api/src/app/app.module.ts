import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module';
import { ChatModule } from '../chat/chat.module';

/**
 * The main module of the application.
 */
@Module({
  imports: [AgentsModule, ChatModule],
  providers: [],
})
export class AppModule {}
