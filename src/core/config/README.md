# Configuration Module

This module provides a comprehensive, type-safe configuration system for the Agent Flow application. It includes validation, environment-specific settings, and centralized configuration management.

## Features

- **Type-safe configuration** with class-validator decorators
- **Environment-specific settings** (.env files for different environments)
- **Joi validation schema** for environment variables
- **Centralized configuration service** with helper methods
- **Modular configuration classes** for different application concerns

## Configuration Classes

### AppConfig

Application-level configuration including port, environment, timeouts, etc.

### DatabaseConfig

Database connection settings for PostgreSQL/MySQL/MongoDB.

### CacheConfig

Redis cache configuration with connection pooling and timeouts.

### AuthConfig

JWT authentication settings, bcrypt rounds, session management.

### EmailConfig

SMTP email configuration with template support.

### StorageConfig

File storage configuration supporting local, AWS S3, Azure Blob, and Google Cloud.

### LoggingConfig

Logging configuration with multiple levels, formats, and rotation.

### RateLimitConfig

API rate limiting configuration with different limits for authenticated/public endpoints.

### CorsConfig

CORS configuration with origin, methods, and headers management.

## Usage

### Basic Usage

```typescript
import { AppConfigService } from '@core/config';

@Injectable()
export class SomeService {
  constructor(private readonly configService: AppConfigService) {}

  someMethod() {
    const port = this.configService.app.port;
    const dbUrl = this.configService.getDatabaseUrl();
    const isProduction = this.configService.isProduction;
  }
}
```

### Accessing Specific Configurations

```typescript
// Get database configuration
const dbConfig = this.configService.database;
console.log(dbConfig.host, dbConfig.port);

// Get email configuration
const emailConfig = this.configService.email;
console.log(emailConfig.host, emailConfig.fromEmail);

// Get storage configuration
const storageConfig = this.configService.storage;
console.log(storageConfig.provider, storageConfig.maxFileSize);
```

### Helper Methods

```typescript
// Environment checks
if (this.configService.isDevelopment) {
  // Development-specific logic
}

// URL builders
const baseUrl = this.configService.getBaseUrl();
const apiUrl = this.configService.getApiBaseUrl();
const dbUrl = this.configService.getDatabaseUrl();
const redisUrl = this.configService.getRedisUrl();

// Environment variable access
const customVar = this.configService.getEnv('CUSTOM_VAR', 'default');
const numVar = this.configService.getEnvNumber('CUSTOM_NUM', 0);
const boolVar = this.configService.getEnvBoolean('CUSTOM_BOOL', false);
```

## Environment Files

The application supports multiple environment files:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment
- `.env.test` - Test environment
- `.env.local` - Local overrides (not committed)
- `.env` - Default fallback

### Environment File Priority

1. `.env.${NODE_ENV}` (e.g., `.env.development`)
2. `.env.local`
3. `.env`

## Validation

All configuration classes use class-validator decorators for validation:

```typescript
export class AppConfig {
  @IsEnum(Environment)
  readonly nodeEnv!: Environment;

  @IsNumber()
  @Min(1024)
  @Max(65535)
  @Transform(({ value }) => parseInt(value as string, 10))
  readonly port!: number;
}
```

Joi validation schema ensures environment variables are properly formatted:

```typescript
const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production', 'test'),
  PORT: Joi.number().port().default(3000),
  // ... more validations
});
```

## Adding New Configuration

1. **Create configuration class** with validation decorators
2. **Add registerAs factory** function
3. **Update ConfigModule** imports and providers
4. **Add to AppConfigService** with getter method
5. **Update Joi validation schema**
6. **Add environment variables** to .env files

### Example: Adding API Configuration

```typescript
// api.config.ts
export class ApiConfig {
  @IsString()
  readonly version!: string;

  @IsNumber()
  readonly timeout!: number;

  constructor(config: Partial<ApiConfig>) {
    Object.assign(this, config);
  }
}

export default registerAs('api', () => {
  return new ApiConfig({
    version: process.env.API_VERSION || 'v1',
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
  });
});
```

## Best Practices

1. **Use type-safe access** through AppConfigService
2. **Validate all environment variables** with appropriate decorators
3. **Provide sensible defaults** for non-critical settings
4. **Use environment-specific files** for different deployment stages
5. **Never commit sensitive data** (use .env.local for secrets)
6. **Document all configuration options** in .env.example
7. **Use helper methods** for complex URL building or environment checks

## Security Considerations

- JWT secrets must be at least 32 characters long
- Database passwords should be strong and unique per environment
- Never commit .env.local or production secrets to version control
- Use environment variables for all sensitive configuration
- Validate all inputs to prevent configuration injection attacks

## Troubleshooting

### Configuration Validation Errors

If you see validation errors on startup:

1. Check that all required environment variables are set
2. Verify data types match the validation decorators
3. Ensure JWT secrets meet minimum length requirements
4. Check that enum values match allowed options

### Missing Environment Variables

The application will fail to start if required variables are missing. Check:

1. `.env.${NODE_ENV}` file exists and is properly formatted
2. Required variables like `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `JWT_SECRET` are set
3. File permissions allow reading the .env files

### Type Errors

If TypeScript compilation fails:

1. Ensure all configuration classes are properly exported
2. Check that AppConfigService includes getters for new configurations
3. Verify import paths are correct
4. Run `npm run build` to check for compilation errors
