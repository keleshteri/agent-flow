import { Injectable, Inject } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { AppConfig, Environment } from './app.config';
import { DatabaseConfig } from './database.config';
import { CacheConfig } from './cache.config';
import { AuthConfig } from './auth.config';
import { EmailConfig } from './email.config';
import { StorageConfig } from './storage.config';
import { LoggingConfig } from './logging.config';
import { RateLimitConfig } from './rate-limit.config';
import { CorsConfig } from './cors.config';

/**
 * Type-safe configuration service
 * Provides centralized access to all application configurations
 */
@Injectable()
export class AppConfigService {
  constructor(
    private readonly nestConfigService: NestConfigService,
    @Inject('APP_CONFIG') private readonly appConfig: AppConfig,
    @Inject('DATABASE_CONFIG') private readonly databaseConfig: DatabaseConfig,
    @Inject('CACHE_CONFIG') private readonly cacheConfig: CacheConfig,
    @Inject('AUTH_CONFIG') private readonly authConfig: AuthConfig,
    @Inject('EMAIL_CONFIG') private readonly emailConfig: EmailConfig,
    @Inject('STORAGE_CONFIG') private readonly storageConfig: StorageConfig,
    @Inject('LOGGING_CONFIG') private readonly loggingConfig: LoggingConfig,
    @Inject('RATE_LIMIT_CONFIG') private readonly rateLimitConfig: RateLimitConfig,
    @Inject('CORS_CONFIG') private readonly corsConfig: CorsConfig,
  ) {}

  /**
   * Get application configuration
   */
  get app(): AppConfig {
    return this.appConfig;
  }

  /**
   * Get database configuration
   */
  get database(): DatabaseConfig {
    return this.databaseConfig;
  }

  /**
   * Get cache configuration
   */
  get cache(): CacheConfig {
    return this.cacheConfig;
  }

  /**
   * Get authentication configuration
   */
  get auth(): AuthConfig {
    return this.authConfig;
  }

  /**
   * Get email configuration
   */
  get email(): EmailConfig {
    return this.emailConfig;
  }

  /**
   * Get storage configuration
   */
  get storage(): StorageConfig {
    return this.storageConfig;
  }

  /**
   * Get logging configuration
   */
  get logging(): LoggingConfig {
    return this.loggingConfig;
  }

  /**
   * Get rate limiting configuration
   */
  get rateLimit(): RateLimitConfig {
    return this.rateLimitConfig;
  }

  /**
   * Get CORS configuration
   */
  get cors(): CorsConfig {
    return this.corsConfig;
  }

  /**
   * Check if running in development mode
   */
  get isDevelopment(): boolean {
    return this.app.nodeEnv === Environment.DEVELOPMENT;
  }

  /**
   * Check if running in production mode
   */
  get isProduction(): boolean {
    return this.app.nodeEnv === Environment.PRODUCTION;
  }

  /**
   * Check if running in staging mode
   */
  get isStaging(): boolean {
    return this.app.nodeEnv === Environment.STAGING;
  }

  /**
   * Check if running in test mode
   */
  get isTest(): boolean {
    return this.app.nodeEnv === Environment.TEST;
  }

  /**
   * Get environment variable with fallback
   */
  getEnv(key: string, defaultValue = ''): string {
    return this.nestConfigService.get<string>(key, defaultValue) || defaultValue;
  }

  /**
   * Get environment variable as number with fallback
   */
  getEnvNumber(key: string, defaultValue = 0): number {
    const value = this.nestConfigService.get<string>(key);
    if (value === undefined) {
      return defaultValue;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Get environment variable as boolean with fallback
   */
  getEnvBoolean(key: string, defaultValue = false): boolean {
    const value = this.nestConfigService.get<string>(key);
    if (value === undefined) {
      return defaultValue;
    }
    return value.toLowerCase() === 'true';
  }

  /**
   * Get database connection URL
   */
  getDatabaseUrl(): string {
    const { type, host, port, username, password, database } = this.database;
    return `${type}://${username}:${password}@${host}:${port}/${database}`;
  }

  /**
   * Get Redis connection URL
   */
  getRedisUrl(): string {
    const { host, port, password, database } = this.cache;
    const auth = password ? `:${password}@` : '';
    return `redis://${auth}${host}:${port}/${database}`;
  }

  /**
   * Get application base URL
   */
  getBaseUrl(): string {
    const protocol = this.isProduction ? 'https' : 'http';
    const host = this.getEnv('HOST', 'localhost');
    const port = this.app.port;
    return `${protocol}://${host}${port !== 80 && port !== 443 ? `:${port}` : ''}`;
  }

  /**
   * Get API base URL with global prefix
   */
  getApiBaseUrl(): string {
    return `${this.getBaseUrl()}/${this.app.globalPrefix}`;
  }
}
