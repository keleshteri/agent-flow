import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config';

/**
 * Application module
 */
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
