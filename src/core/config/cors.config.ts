import { registerAs } from '@nestjs/config';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * CORS configuration class with validation
 */
export class CorsConfig {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enabled!: boolean;

  @IsString()
  readonly origin!: string;

  @IsString()
  readonly methods!: string;

  @IsString()
  readonly allowedHeaders!: string;

  @IsString()
  @IsOptional()
  readonly exposedHeaders?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly credentials!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly preflightContinue!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly optionsSuccessStatus!: boolean;

  constructor(config: Partial<CorsConfig>) {
    Object.assign(this, config);
  }

  /**
   * Get parsed origins array
   */
  getOrigins(): string[] | boolean {
    if (this.origin === '*') {
      return true;
    }
    return this.origin.split(',').map((origin) => origin.trim());
  }

  /**
   * Get parsed methods array
   */
  getMethods(): string[] {
    return this.methods.split(',').map((method) => method.trim().toUpperCase());
  }

  /**
   * Get parsed allowed headers array
   */
  getAllowedHeaders(): string[] {
    return this.allowedHeaders.split(',').map((header) => header.trim());
  }

  /**
   * Get parsed exposed headers array
   */
  getExposedHeaders(): string[] | undefined {
    if (!this.exposedHeaders) {
      return undefined;
    }
    return this.exposedHeaders.split(',').map((header) => header.trim());
  }
}

/**
 * CORS configuration factory
 */
export default registerAs('cors', () => {
  return new CorsConfig({
    enabled: process.env.CORS_ENABLED !== 'false',
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Accept,Authorization,X-Requested-With',
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS,
    credentials: process.env.CORS_CREDENTIALS === 'true',
    preflightContinue: process.env.CORS_PREFLIGHT_CONTINUE === 'true',
    optionsSuccessStatus: process.env.CORS_OPTIONS_SUCCESS_STATUS !== 'false',
  });
});
