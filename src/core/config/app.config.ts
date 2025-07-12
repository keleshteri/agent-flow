import { registerAs } from '@nestjs/config';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Application environment types
 */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

/**
 * Application configuration class with validation
 */
export class AppConfig {
  @IsEnum(Environment)
  readonly nodeEnv!: Environment;

  @IsNumber()
  @Min(1024)
  @Max(65535)
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly port!: number;

  @IsString()
  readonly appName!: string;

  @IsString()
  readonly appVersion!: string;

  @IsString()
  @IsOptional()
  readonly appDescription?: string;

  @IsString()
  readonly globalPrefix!: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly requestTimeout!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly maxRequestSize!: number;

  constructor(config: Partial<AppConfig>) {
    Object.assign(this, config);
  }
}

/**
 * Application configuration factory
 */
export default registerAs('app', (): AppConfig => {
  return new AppConfig({
    nodeEnv: (process.env.NODE_ENV as Environment) || Environment.DEVELOPMENT,
    port: parseInt(process.env.PORT || '3000', 10),
    appName: process.env.APP_NAME || 'agent-flow',
    appVersion: process.env.APP_VERSION || '1.0.0',
    appDescription: process.env.APP_DESCRIPTION || 'NestJS Agent Flow Application',
    globalPrefix: process.env.GLOBAL_PREFIX || 'api/v1',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
    maxRequestSize: parseInt(process.env.MAX_REQUEST_SIZE || '10485760', 10), // 10MB
  });
});
