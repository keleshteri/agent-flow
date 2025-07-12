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
  GLOBAL_PREFIX: Joi.string().default('api/v1'),

  // Database configuration
  DATABASE_TYPE: Joi.string().valid('postgres', 'mysql', 'mongodb').default('postgres'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  // Redis configuration
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),

  // JWT configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Email configuration
  EMAIL_HOST: Joi.string().default('localhost'),
  EMAIL_PORT: Joi.number().port().default(587),
  EMAIL_USERNAME: Joi.string().optional(),
  EMAIL_PASSWORD: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().required(),
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
