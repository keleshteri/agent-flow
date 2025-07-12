import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
//crypto
import * as crypto from 'crypto';

/**
 * Configuration validation utility
 * Provides helpful validation and setup verification for the configuration system
 */
export class ConfigValidator {
  private static readonly logger = new Logger(ConfigValidator.name);

  /**
   * Validate that all required environment files exist
   */
  static validateEnvironmentFiles(): void {
    const requiredFiles = [
      '.env.example',
      '.env.development',
      '.env.staging',
      '.env.production',
      '.env.test',
    ];

    const missingFiles: string[] = [];
    const projectRoot = process.cwd();

    for (const file of requiredFiles) {
      const filePath = path.join(projectRoot, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      this.logger.warn(`Missing environment files: ${missingFiles.join(', ')}`);
      this.logger.warn('Consider creating these files based on .env.example');
    } else {
      this.logger.log('All environment files are present');
    }
  }

  /**
   * Validate JWT secrets meet security requirements
   */
  static validateJwtSecrets(): void {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    const errors: string[] = [];

    if (!jwtSecret) {
      errors.push('JWT_SECRET is required');
    } else if (jwtSecret.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters long');
    }

    if (!jwtRefreshSecret) {
      errors.push('JWT_REFRESH_SECRET is required');
    } else if (jwtRefreshSecret.length < 32) {
      errors.push('JWT_REFRESH_SECRET must be at least 32 characters long');
    }

    if (jwtSecret === jwtRefreshSecret) {
      errors.push('JWT_SECRET and JWT_REFRESH_SECRET must be different');
    }

    if (errors.length > 0) {
      this.logger.error('JWT configuration errors:');
      errors.forEach((error) => this.logger.error(`  - ${error}`));
      throw new Error('Invalid JWT configuration');
    }

    this.logger.log('JWT secrets validation passed');
  }

  /**
   * Validate database configuration
   */
  static validateDatabaseConfig(): void {
    const requiredVars = [
      'DATABASE_HOST',
      'DATABASE_PORT',
      'DATABASE_USERNAME',
      'DATABASE_PASSWORD',
      'DATABASE_NAME',
    ];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      this.logger.error(`Missing database configuration: ${missingVars.join(', ')}`);
      throw new Error('Invalid database configuration');
    }

    const port = parseInt(process.env.DATABASE_PORT || '0', 10);
    if (port < 1 || port > 65535) {
      this.logger.error('DATABASE_PORT must be a valid port number (1-65535)');
      throw new Error('Invalid database port');
    }

    this.logger.log('Database configuration validation passed');
  }

  /**
   * Validate email configuration
   */
  static validateEmailConfig(): void {
    const emailFrom = process.env.EMAIL_FROM;
    if (!emailFrom) {
      this.logger.error('EMAIL_FROM is required');
      throw new Error('Invalid email configuration');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailFrom)) {
      this.logger.error('EMAIL_FROM must be a valid email address');
      throw new Error('Invalid email configuration');
    }

    const emailPort = parseInt(process.env.EMAIL_PORT || '0', 10);
    if (emailPort < 1 || emailPort > 65535) {
      this.logger.error('EMAIL_PORT must be a valid port number (1-65535)');
      throw new Error('Invalid email port');
    }

    this.logger.log('Email configuration validation passed');
  }

  /**
   * Generate secure JWT secrets
   */
  static generateJwtSecrets(): { jwtSecret: string; jwtRefreshSecret: string } {
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
    return {
      jwtSecret,
      jwtRefreshSecret,
    };
  }

  /**
   * Check for common configuration issues
   */
  static checkCommonIssues(): void {
    const issues: string[] = [];

    // Check for default/weak passwords
    if (process.env.DATABASE_PASSWORD === 'password') {
      issues.push('DATABASE_PASSWORD is using default value "password"');
    }

    // Check for development secrets in production
    if (process.env.NODE_ENV === 'production') {
      if (process.env.JWT_SECRET?.includes('development')) {
        issues.push('JWT_SECRET appears to contain development values in production');
      }
      if (process.env.DATABASE_PASSWORD?.includes('dev')) {
        issues.push('DATABASE_PASSWORD appears to contain development values in production');
      }
    }

    // Check for missing CORS configuration in production
    if (process.env.NODE_ENV === 'production' && process.env.CORS_ORIGIN === '*') {
      issues.push('CORS_ORIGIN is set to "*" in production (security risk)');
    }

    // Check for debug logging in production
    if (process.env.NODE_ENV === 'production' && process.env.LOG_LEVEL === 'debug') {
      issues.push('LOG_LEVEL is set to "debug" in production (performance impact)');
    }

    if (issues.length > 0) {
      this.logger.warn('Configuration issues detected:');
      issues.forEach((issue) => this.logger.warn(`  - ${issue}`));
    }
  }

  /**
   * Run all validations
   */
  static validateAll(): void {
    this.logger.log('Starting configuration validation...');

    try {
      this.validateEnvironmentFiles();
      this.validateJwtSecrets();
      this.validateDatabaseConfig();
      this.validateEmailConfig();
      this.checkCommonIssues();

      this.logger.log('Configuration validation completed successfully');
    } catch (error) {
      this.logger.error('Configuration validation failed');
      throw error;
    }
  }

  /**
   * Print configuration summary (without sensitive data)
   */
  static printConfigSummary(): void {
    this.logger.log('Configuration Summary:');
    this.logger.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    this.logger.log(`  Port: ${process.env.PORT || '3000'}`);
    this.logger.log(
      `  Database: ${process.env.DATABASE_TYPE || 'postgres'}@${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || '5432'}`,
    );
    this.logger.log(
      `  Redis: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    );
    this.logger.log(`  Storage: ${process.env.STORAGE_PROVIDER || 'local'}`);
    this.logger.log(
      `  Email: ${process.env.EMAIL_HOST || 'localhost'}:${process.env.EMAIL_PORT || '587'}`,
    );
    this.logger.log(`  CORS: ${process.env.CORS_ENABLED !== 'false' ? 'enabled' : 'disabled'}`);
    this.logger.log(
      `  Rate Limiting: ${process.env.RATE_LIMIT_ENABLED !== 'false' ? 'enabled' : 'disabled'}`,
    );
  }
}
