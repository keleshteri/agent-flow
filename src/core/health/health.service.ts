import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as process from 'process';
import { CommonUtils } from '../../common/utils/common.utils';
import { AppConfigService } from '../config/config.service';

/**
 * Health service for system information and monitoring
 */
@Injectable()
export class HealthService {
  private readonly startTime: Date;

  constructor(private readonly configService: AppConfigService) {
    this.startTime = new Date();
  }

  /**
   * Get application uptime information
   */
  getUptime() {
    const now = new Date();
    const uptimeMs = now.getTime() - this.startTime.getTime();
    const processUptimeSeconds = process.uptime();
    const systemUptimeSeconds = os.uptime();

    return {
      application: {
        startTime: this.startTime.toISOString(),
        uptime: CommonUtils.formatDuration(uptimeMs),
        uptimeMs,
      },
      process: {
        uptime: CommonUtils.formatDuration(processUptimeSeconds * 1000),
        uptimeSeconds: processUptimeSeconds,
      },
      system: {
        uptime: CommonUtils.formatDuration(systemUptimeSeconds * 1000),
        uptimeSeconds: systemUptimeSeconds,
      },
    };
  }

  /**
   * Get detailed system information
   */
  getSystemInfo() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const loadAverage = os.loadavg();

    return {
      environment: {
        nodeEnv: this.configService.app.nodeEnv,
        nodeVersion: process.version,
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
      },
      memory: {
        total: CommonUtils.formatBytes(os.totalmem()),
        free: CommonUtils.formatBytes(os.freemem()),
        used: CommonUtils.formatBytes(os.totalmem() - os.freemem()),
        usagePercentage: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
        process: {
          rss: CommonUtils.formatBytes(memoryUsage.rss),
          heapTotal: CommonUtils.formatBytes(memoryUsage.heapTotal),
          heapUsed: CommonUtils.formatBytes(memoryUsage.heapUsed),
          external: CommonUtils.formatBytes(memoryUsage.external),
          arrayBuffers: CommonUtils.formatBytes(memoryUsage.arrayBuffers),
        },
      },
      cpu: {
        count: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
        loadAverage: {
          '1min': loadAverage[0],
          '5min': loadAverage[1],
          '15min': loadAverage[2],
        },
        usage: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
      },
      network: {
        interfaces: this.getNetworkInterfaces(),
      },
      process: {
        pid: process.pid,
        ppid: process.ppid,
        title: process.title,
        argv: process.argv,
        execPath: process.execPath,
        cwd: process.cwd(),
      },
    };
  }

  /**
   * Get network interface information
   */
  private getNetworkInterfaces() {
    const interfaces = os.networkInterfaces();
    const result: Record<string, any> = {};

    for (const [name, addresses] of Object.entries(interfaces)) {
      if (addresses) {
        result[name] = addresses
          .filter((addr) => !addr.internal)
          .map((addr) => ({
            address: addr.address,
            family: addr.family,
            mac: addr.mac,
          }));
      }
    }

    return result;
  }

  /**
   * Get application configuration summary (non-sensitive)
   */
  getConfigSummary() {
    return {
      app: {
        name: this.configService.app.appName,
        version: this.configService.app.appVersion,
        environment: this.configService.app.nodeEnv,
        port: this.configService.app.port,
      },
      database: {
        type: this.configService.database.type,
        host: this.configService.database.host,
        port: this.configService.database.port,
        database: this.configService.database.database,
        ssl: this.configService.database.ssl,
      },
      cache: {
        host: this.configService.cache.host,
        port: this.configService.cache.port,
        database: this.configService.cache.database,
      },
      features: {
        rateLimitEnabled: this.configService.rateLimit.enabled,
        corsEnabled: this.configService.cors.enabled,
        requestLogging: this.configService.logging.enableRequestLogging,
      },
    };
  }

  /**
   * Check if application is healthy based on basic criteria
   */
  isApplicationHealthy(): boolean {
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    // Check memory usage (fail if using more than 90% of available memory)
    const memoryUsagePercentage = (memoryUsage.rss / totalMemory) * 100;
    if (memoryUsagePercentage > 90) {
      return false;
    }

    // Check system memory (fail if less than 10% free)
    const systemMemoryUsagePercentage = ((totalMemory - freeMemory) / totalMemory) * 100;
    if (systemMemoryUsagePercentage > 90) {
      return false;
    }

    // Check load average (fail if 1-minute load is too high)
    const loadAverage = os.loadavg();
    const cpuCount = os.cpus().length;
    if (loadAverage.length > 0 && loadAverage[0]! > cpuCount * 2) {
      return false;
    }

    return true;
  }

  /**
   * Get health check metadata
   */
  getHealthMetadata() {
    return {
      version: '1.0.0',
      description: 'NestJS Application Health Check',
      checks: [
        // 'database', 'redis',
        'memory',
        'disk',
      ],
      endpoints: {
        basic: '/health',
        detailed: '/health/detailed',
        liveness: '/health/live',
        readiness: '/health/ready',
        // database: '/health/database',
        // redis: '/health/redis',
        memory: '/health/memory',
        disk: '/health/disk',
      },
    };
  }
}
