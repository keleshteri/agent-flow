import { registerAs } from '@nestjs/config';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Email configuration class with validation
 */
export class EmailConfig {
  @IsString()
  readonly host!: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly port!: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly secure!: boolean;

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsEmail()
  readonly fromEmail!: string;

  @IsString()
  readonly fromName!: string;

  @IsString()
  @IsOptional()
  readonly replyToEmail?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly connectionTimeout!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly greetingTimeout!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly socketTimeout!: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly ignoreTLS!: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly requireTLS!: boolean;

  @IsString()
  @IsOptional()
  readonly templateDir?: string;

  constructor(config: Partial<EmailConfig>) {
    Object.assign(this, config);
  }
}

/**
 * Email configuration factory
 */
export default registerAs('email', () => {
  return new EmailConfig({
    host: process.env.EMAIL_HOST || 'localhost',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    fromEmail: process.env.EMAIL_FROM || 'noreply@agent-flow.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Agent Flow',
    replyToEmail: process.env.EMAIL_REPLY_TO,
    connectionTimeout: parseInt(process.env.EMAIL_CONNECTION_TIMEOUT || '60000', 10),
    greetingTimeout: parseInt(process.env.EMAIL_GREETING_TIMEOUT || '30000', 10),
    socketTimeout: parseInt(process.env.EMAIL_SOCKET_TIMEOUT || '60000', 10),
    ignoreTLS: process.env.EMAIL_IGNORE_TLS === 'true',
    requireTLS: process.env.EMAIL_REQUIRE_TLS === 'true',
    templateDir: process.env.EMAIL_TEMPLATE_DIR || 'src/shared/email/templates',
  });
});
