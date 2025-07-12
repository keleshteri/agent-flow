import { registerAs } from '@nestjs/config';
import { IsBoolean, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Database configuration class with validation
 */
export class DatabaseConfig {
  @IsString()
  readonly type!: string;

  @IsString()
  readonly host!: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly port!: number;

  @IsString()
  readonly username!: string;

  @IsString()
  readonly password!: string;

  @IsString()
  readonly database!: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly synchronize!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly logging!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly ssl!: boolean;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly maxConnections!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly connectionTimeout!: number;

  @IsString()
  @IsOptional()
  readonly schema?: string;

  @IsString()
  @IsOptional()
  readonly migrationsDir?: string;

  @IsString()
  @IsOptional()
  readonly entitiesDir?: string;

  constructor(config: Partial<DatabaseConfig>) {
    Object.assign(this, config);
  }
}

/**
 * Database configuration factory
 */
export default registerAs('database', () => {
  return new DatabaseConfig({
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'agent_flow',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    ssl: process.env.DATABASE_SSL === 'true',
    maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '10', 10),
    connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '60000', 10),
    schema: process.env.DATABASE_SCHEMA,
    migrationsDir: process.env.DATABASE_MIGRATIONS_DIR || 'src/core/database/migrations',
    entitiesDir: process.env.DATABASE_ENTITIES_DIR || 'src/**/*.entity.ts',
  });
});
