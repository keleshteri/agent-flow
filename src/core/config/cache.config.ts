import { registerAs } from '@nestjs/config';
import { IsBoolean, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Cache configuration class with validation
 */
export class CacheConfig {
  @IsString()
  readonly host!: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly port!: number;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsNumber()
  @Min(0)
  @Max(15)
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly database!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly ttl!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly maxConnections!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly connectionTimeout!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly commandTimeout!: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enableReadyCheck!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly lazyConnect!: boolean;

  @IsString()
  @IsOptional()
  readonly keyPrefix?: string;

  constructor(config: Partial<CacheConfig>) {
    Object.assign(this, config);
  }
}

/**
 * Cache configuration factory
 */
export default registerAs('cache', () => {
  return new CacheConfig({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    database: parseInt(process.env.REDIS_DATABASE || '0', 10),
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour
    maxConnections: parseInt(process.env.REDIS_MAX_CONNECTIONS || '10', 10),
    connectionTimeout: parseInt(process.env.REDIS_CONNECTION_TIMEOUT || '10000', 10),
    commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '5000', 10),
    enableReadyCheck: process.env.REDIS_ENABLE_READY_CHECK !== 'false',
    lazyConnect: process.env.REDIS_LAZY_CONNECT === 'true',
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'agent-flow:',
  });
});
