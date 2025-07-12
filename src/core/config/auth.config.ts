import { registerAs } from '@nestjs/config';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Authentication configuration class with validation
 */
export class AuthConfig {
  @IsString()
  @MinLength(32)
  readonly jwtSecret!: string;

  @IsString()
  readonly jwtExpiresIn!: string;

  @IsString()
  @MinLength(32)
  readonly jwtRefreshSecret!: string;

  @IsString()
  readonly jwtRefreshExpiresIn!: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly bcryptRounds!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly maxLoginAttempts!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly lockoutDuration!: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly sessionTimeout!: number;

  @IsString()
  readonly passwordResetTokenExpiry!: string;

  @IsString()
  readonly emailVerificationTokenExpiry!: string;

  constructor(config: Partial<AuthConfig>) {
    Object.assign(this, config);
  }
}

/**
 * Authentication configuration factory
 */
export default registerAs('auth', () => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  if (!jwtRefreshSecret || jwtRefreshSecret.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
  }

  return new AuthConfig({
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    jwtRefreshSecret,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900000', 10), // 15 minutes
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000', 10), // 1 hour
    passwordResetTokenExpiry: process.env.PASSWORD_RESET_TOKEN_EXPIRY || '1h',
    emailVerificationTokenExpiry: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || '24h',
  });
});
