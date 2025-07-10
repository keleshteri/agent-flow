import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentsModule } from '../agents/agents.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [AgentsModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
