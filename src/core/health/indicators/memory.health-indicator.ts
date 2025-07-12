import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import * as os from 'os';
import * as process from 'process';
import * as v8 from 'v8';

import { CommonUtils } from '../../../common/utils/common.utils';

/**
 * Memory health indicator for monitoring system and process memory usage
 */
@Injectable()
export class MemoryHealthIndicator extends HealthIndicator {
  private readonly memoryThresholds = {
    system: {
      warning: 80, // 80% of total system memory
      critical: 90, // 90% of total system memory
    },
    process: {
      warning: 512 * 1024 * 1024, // 512MB
      critical: 1024 * 1024 * 1024, // 1GB
    },
    heap: {
      warning: 80, // 80% of heap limit
      critical: 90, // 90% of heap limit
    },
  };

  /**
   * Check memory health
   */
  isHealthy(key: string): HealthIndicatorResult {
    const memoryInfo = this.getMemoryInfo();
    const isHealthy = this.evaluateMemoryHealth(memoryInfo);

    if (isHealthy) {
      return this.getStatus(key, true, {
        status: 'healthy',
        ...memoryInfo,
        timestamp: new Date().toISOString(),
      });
    } else {
      const result = this.getStatus(key, false, {
        status: 'unhealthy',
        ...memoryInfo,
        timestamp: new Date().toISOString(),
      });

      throw new HealthCheckError('Memory check failed', result);
    }
  }

  /**
   * Get comprehensive memory information
   */
  private getMemoryInfo() {
    const systemMemory = this.getSystemMemoryInfo();
    const processMemory = this.getProcessMemoryInfo();
    const heapMemory = this.getHeapMemoryInfo();

    return {
      system: systemMemory,
      process: processMemory,
      heap: heapMemory,
      thresholds: this.memoryThresholds,
    };
  }

  /**
   * Get system memory information
   */
  private getSystemMemoryInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usagePercentage = (usedMemory / totalMemory) * 100;

    return {
      total: CommonUtils.formatBytes(totalMemory),
      free: CommonUtils.formatBytes(freeMemory),
      used: CommonUtils.formatBytes(usedMemory),
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      status: this.getMemoryStatus(usagePercentage, this.memoryThresholds.system),
      raw: {
        total: totalMemory,
        free: freeMemory,
        used: usedMemory,
      },
    };
  }

  /**
   * Get process memory information
   */
  private getProcessMemoryInfo() {
    const memoryUsage = process.memoryUsage();

    return {
      rss: {
        value: CommonUtils.formatBytes(memoryUsage.rss),
        raw: memoryUsage.rss,
        description: 'Resident Set Size - total memory allocated for the process',
        status: this.getMemoryStatus(memoryUsage.rss, this.memoryThresholds.process, false),
      },
      heapTotal: {
        value: CommonUtils.formatBytes(memoryUsage.heapTotal),
        raw: memoryUsage.heapTotal,
        description: 'Total heap memory allocated',
      },
      heapUsed: {
        value: CommonUtils.formatBytes(memoryUsage.heapUsed),
        raw: memoryUsage.heapUsed,
        description: 'Heap memory currently in use',
      },
      external: {
        value: CommonUtils.formatBytes(memoryUsage.external),
        raw: memoryUsage.external,
        description: 'Memory used by C++ objects bound to JavaScript objects',
      },
      arrayBuffers: {
        value: CommonUtils.formatBytes(memoryUsage.arrayBuffers),
        raw: memoryUsage.arrayBuffers,
        description: 'Memory allocated for ArrayBuffers and SharedArrayBuffers',
      },
    };
  }

  /**
   * Get heap memory information
   */
  private getHeapMemoryInfo() {
    const memoryUsage = process.memoryUsage();
    const heapUsagePercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    // Estimate heap limit (V8 default is around 1.4GB on 64-bit systems)
    const estimatedHeapLimit = this.getHeapLimit();
    const heapLimitUsagePercentage = (memoryUsage.heapTotal / estimatedHeapLimit) * 100;

    return {
      used: CommonUtils.formatBytes(memoryUsage.heapUsed),
      total: CommonUtils.formatBytes(memoryUsage.heapTotal),
      limit: CommonUtils.formatBytes(estimatedHeapLimit),
      usagePercentage: Math.round(heapUsagePercentage * 100) / 100,
      limitUsagePercentage: Math.round(heapLimitUsagePercentage * 100) / 100,
      status: this.getMemoryStatus(heapLimitUsagePercentage, this.memoryThresholds.heap),
      raw: {
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        limit: estimatedHeapLimit,
      },
    };
  }

  /**
   * Get estimated heap limit
   */
  private getHeapLimit(): number {
    // Try to get actual heap limit from V8
    try {
      const heapStats = v8.getHeapStatistics();
      return heapStats.heap_size_limit;
    } catch {
      // Fallback to estimated value (1.4GB for 64-bit systems)
      return 1.4 * 1024 * 1024 * 1024;
    }
  }

  /**
   * Get memory status based on thresholds
   */
  private getMemoryStatus(
    value: number,
    thresholds: { warning: number; critical: number },
    isPercentage: boolean = true,
  ): string {
    const threshold = isPercentage ? value : value / (1024 * 1024 * 1024); // Convert to GB for absolute values
    const warningLimit = isPercentage
      ? thresholds.warning
      : thresholds.warning / (1024 * 1024 * 1024);
    const criticalLimit = isPercentage
      ? thresholds.critical
      : thresholds.critical / (1024 * 1024 * 1024);

    if (threshold >= criticalLimit) {
      return 'critical';
    } else if (threshold >= warningLimit) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }

  /**
   * Evaluate overall memory health
   */
  private evaluateMemoryHealth(memoryInfo: any): boolean {
    // Check system memory
    if (memoryInfo.system.status === 'critical') {
      return false;
    }

    // Check process RSS memory
    if (memoryInfo.process.rss.status === 'critical') {
      return false;
    }

    // Check heap memory
    if (memoryInfo.heap.status === 'critical') {
      return false;
    }

    return true;
  }

  /**
   * Get detailed memory analysis
   */
  getDetailedMemoryAnalysis() {
    const memoryInfo = this.getMemoryInfo();
    const gcInfo = this.getGarbageCollectionInfo();
    const recommendations = this.getMemoryRecommendations(memoryInfo);

    return {
      ...memoryInfo,
      garbageCollection: gcInfo,
      recommendations,
      analysis: {
        overallStatus: this.evaluateMemoryHealth(memoryInfo) ? 'healthy' : 'unhealthy',
        criticalIssues: this.getCriticalIssues(memoryInfo),
        warnings: this.getWarnings(memoryInfo),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get garbage collection information
   */
  private getGarbageCollectionInfo() {
    try {
      const heapStats = v8.getHeapStatistics();

      return {
        totalHeapSize: CommonUtils.formatBytes(heapStats.total_heap_size),
        totalHeapSizeExecutable: CommonUtils.formatBytes(heapStats.total_heap_size_executable),
        totalPhysicalSize: CommonUtils.formatBytes(heapStats.total_physical_size),
        totalAvailableSize: CommonUtils.formatBytes(heapStats.total_available_size),
        usedHeapSize: CommonUtils.formatBytes(heapStats.used_heap_size),
        heapSizeLimit: CommonUtils.formatBytes(heapStats.heap_size_limit),
        mallocedMemory: CommonUtils.formatBytes(heapStats.malloced_memory),
        peakMallocedMemory: CommonUtils.formatBytes(heapStats.peak_malloced_memory),
        doesZapGarbage: heapStats.does_zap_garbage,
        numberOfNativeContexts: heapStats.number_of_native_contexts,
        numberOfDetachedContexts: heapStats.number_of_detached_contexts,
      };
    } catch {
      return {
        error: 'V8 heap statistics not available',
      };
    }
  }

  /**
   * Get memory optimization recommendations
   */
  private getMemoryRecommendations(memoryInfo: any): string[] {
    const recommendations: string[] = [];

    if (memoryInfo.system.usagePercentage > 85) {
      recommendations.push(
        'System memory usage is high. Consider adding more RAM or optimizing memory usage.',
      );
    }

    if (
      memoryInfo.process.rss.status === 'warning' ||
      memoryInfo.process.rss.status === 'critical'
    ) {
      recommendations.push(
        'Process memory usage is high. Consider optimizing application memory usage.',
      );
    }

    if (memoryInfo.heap.limitUsagePercentage > 70) {
      recommendations.push(
        'Heap usage is approaching limit. Consider increasing heap size or optimizing memory allocation.',
      );
    }

    if (memoryInfo.heap.usagePercentage > 80) {
      recommendations.push(
        'High heap usage detected. Consider running garbage collection or optimizing object lifecycle.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Memory usage is within healthy limits.');
    }

    return recommendations;
  }

  /**
   * Get critical memory issues
   */
  private getCriticalIssues(memoryInfo: any): string[] {
    const issues: string[] = [];

    if (memoryInfo.system.status === 'critical') {
      issues.push(`System memory usage is critical: ${memoryInfo.system.usagePercentage}%`);
    }

    if (memoryInfo.process.rss.status === 'critical') {
      issues.push(`Process memory usage is critical: ${memoryInfo.process.rss.value}`);
    }

    if (memoryInfo.heap.status === 'critical') {
      issues.push(
        `Heap memory usage is critical: ${memoryInfo.heap.limitUsagePercentage}% of limit`,
      );
    }

    return issues;
  }

  /**
   * Get memory warnings
   */
  private getWarnings(memoryInfo: any): string[] {
    const warnings: string[] = [];

    if (memoryInfo.system.status === 'warning') {
      warnings.push(`System memory usage is high: ${memoryInfo.system.usagePercentage}%`);
    }

    if (memoryInfo.process.rss.status === 'warning') {
      warnings.push(`Process memory usage is high: ${memoryInfo.process.rss.value}`);
    }

    if (memoryInfo.heap.status === 'warning') {
      warnings.push(`Heap memory usage is high: ${memoryInfo.heap.limitUsagePercentage}% of limit`);
    }

    return warnings;
  }
}
