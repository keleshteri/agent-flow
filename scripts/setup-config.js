#!/usr/bin/env node

/**
 * Configuration Setup Script
 *
 * This script helps developers set up their environment configuration:
 * - Validates existing configuration
 * - Generates secure JWT secrets
 * - Creates missing environment files
 * - Provides setup guidance
 *
 * Usage:
 *   node scripts/setup-config.js
 *   npm run setup:config
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ConfigSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.envFiles = [
      '.env.example',
      '.env.development',
      '.env.staging',
      '.env.production',
      '.env.test',
    ];
  }

  /**
   * Main setup process
   */
  async run() {
    console.log('🚀 Agent Flow Configuration Setup\n');

    try {
      this.checkEnvironmentFiles();
      this.validateCurrentConfig();
      await this.offerSecretGeneration();
      this.printSetupGuidance();

      console.log('\n✅ Configuration setup completed successfully!');
    } catch (error) {
      console.error('\n❌ Configuration setup failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Check if environment files exist
   */
  checkEnvironmentFiles() {
    console.log('📁 Checking environment files...');

    const missingFiles = [];
    const existingFiles = [];

    for (const file of this.envFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        existingFiles.push(file);
      } else {
        missingFiles.push(file);
      }
    }

    console.log(`   ✅ Found: ${existingFiles.join(', ')}`);

    if (missingFiles.length > 0) {
      console.log(`   ⚠️  Missing: ${missingFiles.join(', ')}`);
      console.log('   💡 Consider creating these files based on .env.example');
    }
  }

  /**
   * Validate current configuration
   */
  validateCurrentConfig() {
    console.log('\n🔍 Validating current configuration...');

    // Load environment variables from .env.development if it exists
    const devEnvPath = path.join(this.projectRoot, '.env.development');
    if (fs.existsSync(devEnvPath)) {
      const envContent = fs.readFileSync(devEnvPath, 'utf8');
      const envVars = this.parseEnvFile(envContent);

      this.validateJwtSecrets(envVars);
      this.validateDatabaseConfig(envVars);
      this.validateEmailConfig(envVars);
      this.checkSecurityIssues(envVars);
    } else {
      console.log('   ⚠️  .env.development not found, skipping validation');
    }
  }

  /**
   * Parse environment file content
   */
  parseEnvFile(content) {
    const envVars = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        envVars[key] = valueParts.join('=');
      }
    }

    return envVars;
  }

  /**
   * Validate JWT secrets
   */
  validateJwtSecrets(envVars) {
    const jwtSecret = envVars.JWT_SECRET;
    const jwtRefreshSecret = envVars.JWT_REFRESH_SECRET;

    const issues = [];

    if (!jwtSecret) {
      issues.push('JWT_SECRET is missing');
    } else if (jwtSecret.length < 32) {
      issues.push('JWT_SECRET is too short (minimum 32 characters)');
    }

    if (!jwtRefreshSecret) {
      issues.push('JWT_REFRESH_SECRET is missing');
    } else if (jwtRefreshSecret.length < 32) {
      issues.push('JWT_REFRESH_SECRET is too short (minimum 32 characters)');
    }

    if (jwtSecret && jwtRefreshSecret && jwtSecret === jwtRefreshSecret) {
      issues.push('JWT_SECRET and JWT_REFRESH_SECRET must be different');
    }

    if (issues.length > 0) {
      console.log('   ❌ JWT Configuration Issues:');
      issues.forEach((issue) => console.log(`      - ${issue}`));
    } else {
      console.log('   ✅ JWT secrets are valid');
    }
  }

  /**
   * Validate database configuration
   */
  validateDatabaseConfig(envVars) {
    const required = [
      'DATABASE_HOST',
      'DATABASE_PORT',
      'DATABASE_USERNAME',
      'DATABASE_PASSWORD',
      'DATABASE_NAME',
    ];
    const missing = required.filter((key) => !envVars[key]);

    if (missing.length > 0) {
      console.log('   ❌ Missing database configuration:');
      missing.forEach((key) => console.log(`      - ${key}`));
    } else {
      console.log('   ✅ Database configuration is complete');
    }
  }

  /**
   * Validate email configuration
   */
  validateEmailConfig(envVars) {
    const emailFrom = envVars.EMAIL_FROM;

    if (!emailFrom) {
      console.log('   ❌ EMAIL_FROM is missing');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFrom)) {
      console.log('   ❌ EMAIL_FROM is not a valid email address');
    } else {
      console.log('   ✅ Email configuration is valid');
    }
  }

  /**
   * Check for security issues
   */
  checkSecurityIssues(envVars) {
    const issues = [];

    if (envVars.DATABASE_PASSWORD === 'password') {
      issues.push('DATABASE_PASSWORD is using default value');
    }

    if (envVars.CORS_ORIGIN === '*' && envVars.NODE_ENV === 'production') {
      issues.push('CORS_ORIGIN is set to "*" in production');
    }

    if (issues.length > 0) {
      console.log('   ⚠️  Security Issues:');
      issues.forEach((issue) => console.log(`      - ${issue}`));
    }
  }

  /**
   * Offer to generate secure secrets
   */
  async offerSecretGeneration() {
    console.log('\n🔐 JWT Secret Generation');

    const secrets = this.generateSecrets();

    console.log('   Generated secure JWT secrets:');
    console.log(`   JWT_SECRET=${secrets.jwtSecret}`);
    console.log(`   JWT_REFRESH_SECRET=${secrets.jwtRefreshSecret}`);
    console.log('\n   💡 Copy these to your .env files (replace existing values)');
  }

  /**
   * Generate secure secrets
   */
  generateSecrets() {
    return {
      jwtSecret: crypto.randomBytes(64).toString('hex'),
      jwtRefreshSecret: crypto.randomBytes(64).toString('hex'),
    };
  }

  /**
   * Print setup guidance
   */
  printSetupGuidance() {
    console.log('\n📋 Setup Guidance:');
    console.log('\n   1. Environment Files:');
    console.log('      - Copy .env.example to .env.development');
    console.log('      - Update database credentials');
    console.log('      - Replace JWT secrets with generated ones');
    console.log('      - Configure email settings');

    console.log('\n   2. Database Setup:');
    console.log('      - Ensure PostgreSQL is running');
    console.log('      - Create database: agent_flow_dev');
    console.log('      - Update DATABASE_* variables');

    console.log('\n   3. Redis Setup:');
    console.log('      - Ensure Redis is running on localhost:6379');
    console.log('      - Or update REDIS_* variables');

    console.log('\n   4. Email Setup (Development):');
    console.log('      - Use MailHog for local email testing');
    console.log('      - Or configure real SMTP settings');

    console.log('\n   5. Security:');
    console.log('      - Never commit .env.local to version control');
    console.log('      - Use strong, unique passwords');
    console.log('      - Rotate JWT secrets regularly');

    console.log('\n   6. Validation:');
    console.log('      - Run: npm run start:dev');
    console.log('      - Check logs for configuration errors');
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  const setup = new ConfigSetup();
  setup.run().catch(console.error);
}

module.exports = ConfigSetup;
