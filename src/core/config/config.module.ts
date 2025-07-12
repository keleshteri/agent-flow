import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as Joi from 'joi';

import appConfig, { AppConfig } from './app.config';
import databaseConfig, { DatabaseConfig } from './database.config';
import cacheConfig, { CacheConfig } from './cache.config';
import authConfig, { AuthConfig } from './auth.config';
import emailConfig, { EmailConfig } from './email.config';
import storageConfig, { StorageConfig } from './storage.config';
import loggingConfig, { LoggingConfig } from './logging.config';
import rateLimitConfig, { RateLimitConfig } from './rate-limit.config';
import corsConfig, { CorsConfig } from './cors.config';
import { AppConfigService } from './config.service';

/**
 * Configuration validation schema using Joi
 */
const validationSchema = Joi.object({
  // App configuration
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  APP_NAME: Joi.string().default('agent-flow'),
  APP_VERSION: Joi.string().default('1.0.0'),
  APP_DESCRIPTION: Joi.string().optional(),
  GLOBAL_PREFIX: Joi.string().default('api/v1'),
  REQUEST_TIMEOUT: Joi.number().default(30000),
  MAX_REQUEST_SIZE: Joi.number().default(10485760),

  // Database configuration
  DATABASE_TYPE: Joi.string().valid('postgres', 'mysql', 'mongodb').default('postgres'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_SSL: Joi.boolean().default(false),
  DATABASE_MAX_CONNECTIONS: Joi.number().default(10),
  DATABASE_CONNECTION_TIMEOUT: Joi.number().default(60000),
  DATABASE_SCHEMA: Joi.string().optional(),
  DATABASE_MIGRATIONS_DIR: Joi.string().optional(),
  DATABASE_ENTITIES_DIR: Joi.string().optional(),

  // Redis/Cache configuration
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DATABASE: Joi.number().default(0),
  CACHE_TTL: Joi.number().default(3600),
  REDIS_MAX_CONNECTIONS: Joi.number().default(10),
  REDIS_CONNECTION_TIMEOUT: Joi.number().default(10000),
  REDIS_COMMAND_TIMEOUT: Joi.number().default(5000),
  REDIS_ENABLE_READY_CHECK: Joi.boolean().default(true),
  REDIS_LAZY_CONNECT: Joi.boolean().default(false),
  REDIS_KEY_PREFIX: Joi.string().default('agent-flow:'),

  // JWT configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  BCRYPT_ROUNDS: Joi.number().default(12),
  MAX_LOGIN_ATTEMPTS: Joi.number().default(5),
  LOCKOUT_DURATION: Joi.number().default(900000),
  SESSION_TIMEOUT: Joi.number().default(3600000),
  PASSWORD_RESET_TOKEN_EXPIRY: Joi.string().default('1h'),
  EMAIL_VERIFICATION_TOKEN_EXPIRY: Joi.string().default('24h'),

  // Email configuration
  EMAIL_HOST: Joi.string().default('localhost'),
  EMAIL_PORT: Joi.number().port().default(587),
  EMAIL_SECURE: Joi.boolean().default(false),
  EMAIL_USERNAME: Joi.string().optional(),
  EMAIL_PASSWORD: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().required(),
  EMAIL_FROM_NAME: Joi.string().default('Agent Flow'),
  EMAIL_REPLY_TO: Joi.string().email().optional(),
  EMAIL_CONNECTION_TIMEOUT: Joi.number().default(60000),
  EMAIL_GREETING_TIMEOUT: Joi.number().default(30000),
  EMAIL_SOCKET_TIMEOUT: Joi.number().default(60000),
  EMAIL_IGNORE_TLS: Joi.boolean().default(false),
  EMAIL_REQUIRE_TLS: Joi.boolean().default(false),
  EMAIL_TEMPLATE_DIR: Joi.string().optional(),

  // Storage configuration
  STORAGE_PROVIDER: Joi.string()
    .valid('local', 'aws-s3', 'azure-blob', 'google-cloud')
    .default('local'),
  STORAGE_UPLOAD_DIR: Joi.string().default('uploads'),
  STORAGE_MAX_FILE_SIZE: Joi.number().default(10485760),
  STORAGE_ALLOWED_MIME_TYPES: Joi.string().optional(),
  STORAGE_BASE_URL: Joi.string().default('http://localhost:3000'),
  STORAGE_URL_EXPIRATION_TIME: Joi.number().default(3600),
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().optional(),
  AWS_S3_BUCKET: Joi.string().optional(),
  AZURE_STORAGE_CONNECTION_STRING: Joi.string().optional(),
  AZURE_STORAGE_CONTAINER: Joi.string().optional(),
  GOOGLE_CLOUD_PROJECT_ID: Joi.string().optional(),
  GOOGLE_CLOUD_KEY_FILENAME: Joi.string().optional(),
  GOOGLE_CLOUD_STORAGE_BUCKET: Joi.string().optional(),

  // Logging configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  LOG_FORMAT: Joi.string().valid('json', 'simple', 'combined').default('json'),
  LOG_ENABLE_CONSOLE: Joi.boolean().default(true),
  LOG_ENABLE_FILE: Joi.boolean().default(false),
  LOG_DIR: Joi.string().default('logs'),
  LOG_ERROR_FILE: Joi.string().default('error.log'),
  LOG_COMBINED_FILE: Joi.string().default('combined.log'),
  LOG_MAX_FILE_SIZE: Joi.number().default(20971520),
  LOG_MAX_FILES: Joi.number().default(14),
  LOG_ENABLE_ROTATION: Joi.boolean().default(true),
  LOG_ENABLE_TIMESTAMP: Joi.boolean().default(true),
  LOG_ENABLE_COLORIZE: Joi.boolean().default(true),
  LOG_ENABLE_REQUEST_LOGGING: Joi.boolean().default(true),
  LOG_DATE_PATTERN: Joi.string().default('YYYY-MM-DD-HH'),

  // Rate limiting configuration
  RATE_LIMIT_ENABLED: Joi.boolean().default(true),
  RATE_LIMIT_TTL: Joi.number().default(60000),
  RATE_LIMIT_MAX: Joi.number().default(100),
  RATE_LIMIT_AUTH_TTL: Joi.number().default(60000),
  RATE_LIMIT_AUTH_MAX: Joi.number().default(200),
  RATE_LIMIT_PUBLIC_TTL: Joi.number().default(60000),
  RATE_LIMIT_PUBLIC_MAX: Joi.number().default(50),
  RATE_LIMIT_SKIP_IF: Joi.string().optional(),
  RATE_LIMIT_ERROR_MESSAGE: Joi.string().default('Too many requests, please try again later.'),
  RATE_LIMIT_SKIP_SUCCESSFUL: Joi.boolean().default(false),
  RATE_LIMIT_SKIP_FAILED: Joi.boolean().default(false),
  RATE_LIMIT_KEY_GENERATOR: Joi.string().default('ip'),

  // CORS configuration
  CORS_ENABLED: Joi.boolean().default(true),
  CORS_ORIGIN: Joi.string().default('*'),
  CORS_METHODS: Joi.string().default('GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'),
  CORS_ALLOWED_HEADERS: Joi.string().default('Content-Type,Accept,Authorization,X-Requested-With'),
  CORS_EXPOSED_HEADERS: Joi.string().optional(),
  CORS_CREDENTIALS: Joi.boolean().default(false),
  CORS_PREFLIGHT_CONTINUE: Joi.boolean().default(false),
  CORS_OPTIONS_SUCCESS_STATUS: Joi.boolean().default(true),
});

/**
 * Custom validation function for configuration classes
 */
function validateConfig<T extends object>(ConfigClass: new (config: any) => T) {
  return (config: Record<string, unknown>): T => {
    const validatedConfig = plainToClass(ConfigClass, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new Error(`Configuration validation error: ${errorMessages}`);
    }

    return validatedConfig;
  };
}

/**
 * Global configuration module
 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env.local', '.env'],
      load: [
        appConfig,
        databaseConfig,
        cacheConfig,
        authConfig,
        emailConfig,
        storageConfig,
        loggingConfig,
        rateLimitConfig,
        corsConfig,
      ],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [
    ConfigService,
    AppConfigService,
    {
      provide: 'APP_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(AppConfig)(configService.get('app') || {}),
      inject: [ConfigService],
    },
    {
      provide: 'DATABASE_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(DatabaseConfig)(configService.get('database') || {}),
      inject: [ConfigService],
    },
    {
      provide: 'CACHE_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(CacheConfig)(configService.get('cache') || {}),
      inject: [ConfigService],
    },
    {
      provide: 'AUTH_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(AuthConfig)(configService.get('auth') || {}),
      inject: [ConfigService],
    },
    {
      provide: 'EMAIL_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(EmailConfig)(configService.get('email') || {}),
      inject: [ConfigService],
    },
    {
      provide: 'STORAGE_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(StorageConfig)(configService.get('storage') || {}),
      inject: [ConfigService],
    },
    {
      provide: 'LOGGING_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(LoggingConfig)(configService.get('logging') || {}),
      inject: [ConfigService],
    },
    {
      provide: 'RATE_LIMIT_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(RateLimitConfig)(configService.get('rateLimit') || {}),
      inject: [ConfigService],
    },
    {
      provide: 'CORS_CONFIG',
      useFactory: (configService: ConfigService) =>
        validateConfig(CorsConfig)(configService.get('cors') || {}),
      inject: [ConfigService],
    },
  ],
  exports: [
    AppConfigService,
    ConfigService,
    'APP_CONFIG',
    'DATABASE_CONFIG',
    'CACHE_CONFIG',
    'AUTH_CONFIG',
    'EMAIL_CONFIG',
    'STORAGE_CONFIG',
    'LOGGING_CONFIG',
    'RATE_LIMIT_CONFIG',
    'CORS_CONFIG',
  ],
})
export class ConfigModule {}
