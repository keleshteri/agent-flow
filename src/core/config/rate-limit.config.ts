import { registerAs } from '@nestjs/config';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Rate limiting configuration class with validation
 */
export class RateLimitConfig {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enabled!: boolean;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly ttl!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly limit!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly authTtl!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly authLimit!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly publicTtl!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly publicLimit!: number;

  @IsString()
  @IsOptional()
  readonly skipIf?: string;

  @IsString()
  readonly errorMessage!: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly skipSuccessfulRequests!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly skipFailedRequests!: boolean;

  @IsString()
  readonly keyGenerator!: string;

  constructor(config: Partial<RateLimitConfig>) {
    Object.assign(this, config);
  }
}

/**
 * Rate limiting configuration factory
 */
export default registerAs('rateLimit', () => {
  return new RateLimitConfig({
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10), // 1 minute
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per minute
    authTtl: parseInt(process.env.RATE_LIMIT_AUTH_TTL || '60000', 10), // 1 minute
    authLimit: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '200', 10), // 200 requests per minute for authenticated users
    publicTtl: parseInt(process.env.RATE_LIMIT_PUBLIC_TTL || '60000', 10), // 1 minute
    publicLimit: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX || '50', 10), // 50 requests per minute for public endpoints
    skipIf: process.env.RATE_LIMIT_SKIP_IF,
    errorMessage:
      process.env.RATE_LIMIT_ERROR_MESSAGE || 'Too many requests, please try again later.',
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL === 'true',
    skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'true',
    keyGenerator: process.env.RATE_LIMIT_KEY_GENERATOR || 'ip',
  });
});
