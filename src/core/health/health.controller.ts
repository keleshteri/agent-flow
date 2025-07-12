import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { Public } from '../decorators/auth.decorators';
import { SkipTransform } from '../interceptors/transform.interceptor';
import { HealthService } from './health.service';
import { MemoryHealthIndicator } from './indicators/memory.health-indicator';
import { DiskHealthIndicator } from './indicators/disk.health-indicator';

/**
 * Health check controller for monitoring application status
 */
@Controller('health')
@Public()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthService: HealthService,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
  ) {}

  /**
   * Basic health check endpoint
   */
  @Get()
  @SkipTransform()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.memoryHealthIndicator.isHealthy('memory'),
      () => this.diskHealthIndicator.isHealthy('disk'),
    ]);
  }

  /**
   * Detailed health check with system information
   */
  @Get('detailed')
  @SkipTransform()
  async getDetailedHealth() {
    const basicHealth = await this.check();
    const systemInfo = this.healthService.getSystemInfo();
    const uptime = this.healthService.getUptime();

    return {
      ...basicHealth,
      system: systemInfo,
      uptime,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Liveness probe for Kubernetes
   */
  @Get('live')
  @SkipTransform()
  getLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe for Kubernetes
   */
  @Get('ready')
  @SkipTransform()
  @HealthCheck()
  getReadiness(): Promise<HealthCheckResult> {
    return this.health.check([
      // () => this.databaseHealthIndicator.isHealthy('database'),
      // () => this.redisHealthIndicator.isHealthy('redis'),
    ]);
  }

  /**
   * Database-specific health check
   */

  /**
   * Redis-specific health check
   */

  /**
   * Memory usage health check
   */
  @Get('memory')
  @SkipTransform()
  @HealthCheck()
  checkMemory(): Promise<HealthCheckResult> {
    return this.health.check([() => this.memoryHealthIndicator.isHealthy('memory')]);
  }

  /**
   * Disk usage health check
   */
  @Get('disk')
  @SkipTransform()
  @HealthCheck()
  checkDisk(): Promise<HealthCheckResult> {
    return this.health.check([() => this.diskHealthIndicator.isHealthy('disk')]);
  }
}
