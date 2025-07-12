import { registerAs } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Log levels enum
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}

/**
 * Log format enum
 */
export enum LogFormat {
  JSON = 'json',
  SIMPLE = 'simple',
  COMBINED = 'combined',
}

/**
 * Logging configuration class with validation
 */
export class LoggingConfig {
  @IsEnum(LogLevel)
  readonly level!: LogLevel;

  @IsEnum(LogFormat)
  readonly format!: LogFormat;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enableConsole!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enableFile!: boolean;

  @IsString()
  @IsOptional()
  readonly logDir?: string;

  @IsString()
  @IsOptional()
  readonly errorLogFile?: string;

  @IsString()
  @IsOptional()
  readonly combinedLogFile?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly maxFileSize!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly maxFiles!: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enableRotation!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enableTimestamp!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enableColorize!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly enableRequestLogging!: boolean;

  @IsString()
  @IsOptional()
  readonly datePattern?: string;

  constructor(config: Partial<LoggingConfig>) {
    Object.assign(this, config);
  }
}

/**
 * Logging configuration factory
 */
export default registerAs('logging', () => {
  return new LoggingConfig({
    level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    format: (process.env.LOG_FORMAT as LogFormat) || LogFormat.JSON,
    enableConsole: process.env.LOG_ENABLE_CONSOLE !== 'false',
    enableFile: process.env.LOG_ENABLE_FILE === 'true',
    logDir: process.env.LOG_DIR || 'logs',
    errorLogFile: process.env.LOG_ERROR_FILE || 'error.log',
    combinedLogFile: process.env.LOG_COMBINED_FILE || 'combined.log',
    maxFileSize: parseInt(process.env.LOG_MAX_FILE_SIZE || '20971520', 10), // 20MB
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '14', 10), // 14 days
    enableRotation: process.env.LOG_ENABLE_ROTATION !== 'false',
    enableTimestamp: process.env.LOG_ENABLE_TIMESTAMP !== 'false',
    enableColorize: process.env.LOG_ENABLE_COLORIZE !== 'false',
    enableRequestLogging: process.env.LOG_ENABLE_REQUEST_LOGGING !== 'false',
    datePattern: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD-HH',
  });
});
