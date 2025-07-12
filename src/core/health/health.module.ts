import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { MemoryHealthIndicator } from './indicators/memory.health-indicator';
import { DiskHealthIndicator } from './indicators/disk.health-indicator';
import { ConfigModule } from '../config/config.module';

/**
 * Health check module for monitoring application status
 */
@Module({
  imports: [TerminusModule, HttpModule, ConfigModule],
  controllers: [HealthController],
  providers: [HealthService, MemoryHealthIndicator, DiskHealthIndicator],
  exports: [HealthService],
})
export class HealthModule {}
