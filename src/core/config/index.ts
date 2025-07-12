/**
 * Configuration module exports
 * Provides centralized access to all application configurations
 */

// Main configuration module and service
export { ConfigModule } from './config.module';
export { AppConfigService } from './config.service';

// Configuration classes
export { AppConfig, Environment } from './app.config';
export { DatabaseConfig } from './database.config';
export { CacheConfig } from './cache.config';
export { AuthConfig } from './auth.config';
export { EmailConfig } from './email.config';
export { StorageConfig, StorageProvider } from './storage.config';
export { LoggingConfig, LogLevel, LogFormat } from './logging.config';
export { RateLimitConfig } from './rate-limit.config';
export { CorsConfig } from './cors.config';

// Configuration factories (for direct use if needed)
export { default as appConfig } from './app.config';
export { default as databaseConfig } from './database.config';
export { default as cacheConfig } from './cache.config';
export { default as authConfig } from './auth.config';
export { default as emailConfig } from './email.config';
export { default as storageConfig } from './storage.config';
export { default as loggingConfig } from './logging.config';
export { default as rateLimitConfig } from './rate-limit.config';
export { default as corsConfig } from './cors.config';

// Configuration utilities
export { ConfigValidator } from './config.validator';
