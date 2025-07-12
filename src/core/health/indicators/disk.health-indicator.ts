import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

import { CommonUtils } from '../../../common/utils/common.utils';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const execAsync = promisify(exec);

/**
 * Disk health indicator for monitoring disk space usage
 */
@Injectable()
export class DiskHealthIndicator extends HealthIndicator {
  private readonly diskThresholds = {
    warning: 80, // 80% disk usage
    critical: 90, // 90% disk usage
  };

  /**
   * Check disk health
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const diskInfo = await this.getDiskInfo();
      const isHealthy = this.evaluateDiskHealth(diskInfo);

      if (isHealthy) {
        return this.getStatus(key, true, {
          status: 'healthy',
          ...diskInfo,
          timestamp: new Date().toISOString(),
        });
      } else {
        const result = this.getStatus(key, false, {
          status: 'unhealthy',
          ...diskInfo,
          timestamp: new Date().toISOString(),
        });

        throw new HealthCheckError('Disk check failed', result);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const result = this.getStatus(key, false, {
        status: 'error',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });

      throw new HealthCheckError('Disk check failed', result);
    }
  }

  /**
   * Get disk information
   */
  private async getDiskInfo() {
    const rootPath = process.cwd();
    const diskUsage = await this.getDiskUsage(rootPath);
    const tempDirUsage = await this.getTempDirUsage();
    const logDirUsage = await this.getLogDirUsage();

    return {
      root: {
        path: rootPath,
        ...diskUsage,
        status: this.getDiskStatus(diskUsage.usagePercentage),
      },
      temp: tempDirUsage,
      logs: logDirUsage,
      thresholds: this.diskThresholds,
    };
  }

  /**
   * Get disk usage for a specific path
   */
  private async getDiskUsage(targetPath: string) {
    try {
      // For Windows, we need to use a different approach
      if (process.platform === 'win32') {
        return await this.getWindowsDiskUsage(targetPath);
      } else {
        return await this.getUnixDiskUsage(targetPath);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        total: 'Unknown',
        free: 'Unknown',
        used: 'Unknown',
        usagePercentage: 0,
        error: errorMessage,
      };
    }
  }

  /**
   * Get disk usage for Windows systems
   */
  private async getWindowsDiskUsage(targetPath: string) {
    try {
      // Get drive letter from path
      const drive = path.parse(targetPath).root;

      // Use PowerShell to get disk information
      const command = `powershell "Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='${drive.replace('\\', '')}'"|Select-Object Size,FreeSpace"`;
      const { stdout } = await execAsync(command);

      // Parse PowerShell output
      const lines = stdout.trim().split('\n');
      const dataLine = lines.find(
        (line: string) => line.includes('Size') && line.includes('FreeSpace'),
      );

      if (dataLine) {
        const matches = dataLine.match(/(\d+)\s+(\d+)/);
        if (matches && matches[1] && matches[2]) {
          const total = parseInt(matches[1], 10);
          const free = parseInt(matches[2], 10);
          const used = total - free;
          const usagePercentage = (used / total) * 100;

          return {
            total: CommonUtils.formatBytes(total),
            free: CommonUtils.formatBytes(free),
            used: CommonUtils.formatBytes(used),
            usagePercentage: Math.round(usagePercentage * 100) / 100,
            raw: { total, free, used },
          };
        }
      }

      throw new Error('Could not parse disk usage information');
    } catch (_error: unknown) {
      // Fallback to basic file system stats
      return await this.getBasicDiskInfo(targetPath);
    }
  }

  /**
   * Get disk usage for Unix-like systems
   */
  private async getUnixDiskUsage(targetPath: string) {
    try {
      const { stdout } = await execAsync(`df -k "${targetPath}"`);
      const lines = stdout.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('Invalid df output format');
      }

      const dataLine = lines[1]; // Second line contains the data
      if (!dataLine) {
        throw new Error('No data line found in df output');
      }

      const parts = dataLine.split(/\s+/);
      if (parts.length < 4) {
        throw new Error('Invalid df data format');
      }

      const total = parseInt(parts[1]!, 10) * 1024; // Convert from KB to bytes
      const used = parseInt(parts[2]!, 10) * 1024;
      const free = parseInt(parts[3]!, 10) * 1024;
      const usagePercentage = (used / total) * 100;

      return {
        total: CommonUtils.formatBytes(total),
        free: CommonUtils.formatBytes(free),
        used: CommonUtils.formatBytes(used),
        usagePercentage: Math.round(usagePercentage * 100) / 100,
        raw: { total, free, used },
      };
    } catch (_error: unknown) {
      // Fallback to basic file system stats
      return await this.getBasicDiskInfo(targetPath);
    }
  }

  /**
   * Get basic disk information as fallback
   */
  private async getBasicDiskInfo(targetPath: string) {
    try {
      const stats = await stat(targetPath);

      return {
        total: 'Unknown',
        free: 'Unknown',
        used: 'Unknown',
        usagePercentage: 0,
        accessible: true,
        lastModified: stats.mtime.toISOString(),
        isDirectory: stats.isDirectory(),
      };
    } catch (error: unknown) {
      return {
        total: 'Unknown',
        free: 'Unknown',
        used: 'Unknown',
        usagePercentage: 0,
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get temporary directory usage
   */
  private async getTempDirUsage() {
    const tempDir = os.tmpdir();

    try {
      const usage = await this.getDiskUsage(tempDir);
      const dirSize = await this.getDirectorySize(tempDir);

      return {
        path: tempDir,
        ...usage,
        directorySize: CommonUtils.formatBytes(dirSize),
        status: this.getDiskStatus(usage.usagePercentage),
      };
    } catch (error: unknown) {
      return {
        path: tempDir,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
      };
    }
  }

  /**
   * Get log directory usage
   */
  private async getLogDirUsage() {
    const logDir = path.join(process.cwd(), 'logs');

    try {
      const dirExists = await this.directoryExists(logDir);

      if (!dirExists) {
        return {
          path: logDir,
          exists: false,
          status: 'not_found',
        };
      }

      const dirSize = await this.getDirectorySize(logDir);
      const fileCount = await this.getFileCount(logDir);

      return {
        path: logDir,
        exists: true,
        size: CommonUtils.formatBytes(dirSize),
        fileCount,
        status: 'healthy',
        raw: { size: dirSize },
      };
    } catch (error: unknown) {
      return {
        path: logDir,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
      };
    }
  }

  /**
   * Get directory size recursively
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    try {
      const items = await readdir(dirPath);
      let totalSize = 0;

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = await stat(itemPath);

        if (stats.isDirectory()) {
          totalSize += await this.getDirectorySize(itemPath);
        } else {
          totalSize += stats.size;
        }
      }

      return totalSize;
    } catch (_error: unknown) {
      return 0;
    }
  }

  /**
   * Get file count in directory
   */
  private async getFileCount(dirPath: string): Promise<number> {
    try {
      const items = await readdir(dirPath);
      let fileCount = 0;

      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = await stat(itemPath);

        if (stats.isFile()) {
          fileCount++;
        } else if (stats.isDirectory()) {
          fileCount += await this.getFileCount(itemPath);
        }
      }

      return fileCount;
    } catch (_error: unknown) {
      return 0;
    }
  }

  /**
   * Check if directory exists
   */
  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Get disk status based on usage percentage
   */
  private getDiskStatus(usagePercentage: number): string {
    if (usagePercentage >= this.diskThresholds.critical) {
      return 'critical';
    } else if (usagePercentage >= this.diskThresholds.warning) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }

  /**
   * Evaluate overall disk health
   */
  private evaluateDiskHealth(diskInfo: any): boolean {
    // Check root disk usage
    if (diskInfo.root.status === 'critical') {
      return false;
    }

    // Check temp directory usage
    if (diskInfo.temp.status === 'critical') {
      return false;
    }

    return true;
  }

  /**
   * Get detailed disk analysis
   */
  async getDetailedDiskAnalysis() {
    const diskInfo = await this.getDiskInfo();
    const recommendations = this.getDiskRecommendations(diskInfo);
    const criticalIssues = this.getCriticalDiskIssues(diskInfo);
    const warnings = this.getDiskWarnings(diskInfo);

    return {
      ...diskInfo,
      analysis: {
        overallStatus: this.evaluateDiskHealth(diskInfo) ? 'healthy' : 'unhealthy',
        criticalIssues,
        warnings,
        recommendations,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get disk optimization recommendations
   */
  private getDiskRecommendations(diskInfo: any): string[] {
    const recommendations: string[] = [];

    if (diskInfo.root.usagePercentage > 85) {
      recommendations.push(
        'Root disk usage is high. Consider cleaning up unnecessary files or expanding disk space.',
      );
    }

    if (diskInfo.temp.usagePercentage > 80) {
      recommendations.push('Temporary directory usage is high. Consider cleaning up temp files.');
    }

    if (diskInfo.logs.exists && diskInfo.logs.raw?.size > 100 * 1024 * 1024) {
      // 100MB
      recommendations.push(
        'Log directory is large. Consider implementing log rotation or cleanup.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Disk usage is within healthy limits.');
    }

    return recommendations;
  }

  /**
   * Get critical disk issues
   */
  private getCriticalDiskIssues(diskInfo: any): string[] {
    const issues: string[] = [];

    if (diskInfo.root.status === 'critical') {
      issues.push(`Root disk usage is critical: ${diskInfo.root.usagePercentage}%`);
    }

    if (diskInfo.temp.status === 'critical') {
      issues.push(`Temporary directory usage is critical: ${diskInfo.temp.usagePercentage}%`);
    }

    return issues;
  }

  /**
   * Get disk warnings
   */
  private getDiskWarnings(diskInfo: any): string[] {
    const warnings: string[] = [];

    if (diskInfo.root.status === 'warning') {
      warnings.push(`Root disk usage is high: ${diskInfo.root.usagePercentage}%`);
    }

    if (diskInfo.temp.status === 'warning') {
      warnings.push(`Temporary directory usage is high: ${diskInfo.temp.usagePercentage}%`);
    }

    return warnings;
  }
}
