import { registerAs } from '@nestjs/config';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Storage provider types
 */
export enum StorageProvider {
  LOCAL = 'local',
  AWS_S3 = 'aws-s3',
  AZURE_BLOB = 'azure-blob',
  GOOGLE_CLOUD = 'google-cloud',
}

/**
 * File storage configuration class with validation
 */
export class StorageConfig {
  @IsEnum(StorageProvider)
  readonly provider!: StorageProvider;

  @IsString()
  readonly uploadDir!: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly maxFileSize!: number;

  @IsString()
  readonly allowedMimeTypes!: string;

  @IsString()
  @IsOptional()
  readonly awsAccessKeyId?: string;

  @IsString()
  @IsOptional()
  readonly awsSecretAccessKey?: string;

  @IsString()
  @IsOptional()
  readonly awsRegion?: string;

  @IsString()
  @IsOptional()
  readonly awsBucket?: string;

  @IsString()
  @IsOptional()
  readonly azureConnectionString?: string;

  @IsString()
  @IsOptional()
  readonly azureContainer?: string;

  @IsString()
  @IsOptional()
  readonly googleProjectId?: string;

  @IsString()
  @IsOptional()
  readonly googleKeyFilename?: string;

  @IsString()
  @IsOptional()
  readonly googleBucket?: string;

  @IsString()
  readonly baseUrl!: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly urlExpirationTime!: number;

  constructor(config: Partial<StorageConfig>) {
    Object.assign(this, config);
  }
}

/**
 * Storage configuration factory
 */
export default registerAs('storage', () => {
  return new StorageConfig({
    provider: (process.env.STORAGE_PROVIDER as StorageProvider) || StorageProvider.LOCAL,
    uploadDir: process.env.STORAGE_UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.STORAGE_MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedMimeTypes:
      process.env.STORAGE_ALLOWED_MIME_TYPES ||
      'image/jpeg,image/png,image/gif,application/pdf,text/plain',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    awsBucket: process.env.AWS_S3_BUCKET,
    azureConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    azureContainer: process.env.AZURE_STORAGE_CONTAINER,
    googleProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    googleKeyFilename: process.env.GOOGLE_CLOUD_KEY_FILENAME,
    googleBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
    baseUrl: process.env.STORAGE_BASE_URL || 'http://localhost:3000',
    urlExpirationTime: parseInt(process.env.STORAGE_URL_EXPIRATION_TIME || '3600', 10), // 1 hour
  });
});
