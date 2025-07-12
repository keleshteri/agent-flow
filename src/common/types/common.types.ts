/**
 * Common types and interfaces used across the application
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly error?: string;
  readonly timestamp: string;
  readonly path?: string;
  readonly statusCode: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'ASC' | 'DESC';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNext: boolean;
    readonly hasPrevious: boolean;
  };
}

/**
 * Filter parameters
 */
export interface FilterParams {
  readonly search?: string;
  readonly startDate?: Date;
  readonly endDate?: Date;
  readonly status?: string;
  readonly [key: string]: any;
}

/**
 * Sort parameters
 */
export interface SortParams {
  readonly field: string;
  readonly order: 'ASC' | 'DESC';
}

/**
 * Query parameters combining pagination, filtering, and sorting
 */
export interface QueryParams extends PaginationParams, FilterParams {
  readonly sort?: SortParams[];
}

/**
 * File upload information
 */
export interface FileInfo {
  readonly originalName: string;
  readonly filename: string;
  readonly mimetype: string;
  readonly size: number;
  readonly path: string;
  readonly url: string;
}

/**
 * Error details
 */
export interface ErrorDetails {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly value?: any;
}

/**
 * Validation error
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly value?: any;
}

/**
 * Database transaction options
 */
export interface TransactionOptions {
  readonly isolation?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
  readonly timeout?: number;
}

/**
 * Cache options
 */
export interface CacheOptions {
  readonly ttl?: number;
  readonly key?: string;
  readonly tags?: string[];
}

/**
 * Event payload base interface
 */
export interface EventPayload {
  readonly eventId: string;
  readonly timestamp: Date;
  readonly userId?: string;
  readonly correlationId?: string;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  readonly id: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  readonly userId?: string;
  readonly timestamp: Date;
  readonly oldValues?: Record<string, any>;
  readonly newValues?: Record<string, any>;
  readonly metadata?: Record<string, any>;
}

/**
 * Health check status
 */
export interface HealthCheckStatus {
  readonly status: 'ok' | 'error' | 'shutting_down';
  readonly timestamp: string;
  readonly uptime: number;
  readonly version: string;
  readonly environment: string;
  readonly checks: {
    readonly database: 'ok' | 'error';
    readonly redis: 'ok' | 'error';
    readonly memory: 'ok' | 'warning' | 'error';
    readonly disk: 'ok' | 'warning' | 'error';
  };
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  readonly limit: number;
  readonly remaining: number;
  readonly resetTime: Date;
  readonly retryAfter?: number;
}

/**
 * JWT payload
 */
export interface JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly roles: string[];
  readonly permissions: string[];
  readonly iat: number;
  readonly exp: number;
  readonly jti?: string;
}

/**
 * User context for requests
 */
export interface UserContext {
  readonly id: string;
  readonly email: string;
  readonly roles: string[];
  readonly permissions: string[];
  readonly isActive: boolean;
}

/**
 * Request context
 */
export interface RequestContext {
  readonly requestId: string;
  readonly correlationId: string;
  readonly timestamp: Date;
  readonly userAgent?: string;
  readonly ip: string;
  readonly user?: UserContext;
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  readonly isValid: boolean;
  readonly errors: ValidationError[];
  readonly warnings: string[];
}

/**
 * Generic result type for operations that can fail
 */
export type Result<T, E = Error> =
  | {
      readonly success: true;
      readonly data: T;
    }
  | {
      readonly success: false;
      readonly error: E;
    };

/**
 * Optional type helper
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Deep partial type helper
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Constructor type helper
 */
export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Class decorator type
 */
export type ClassDecorator<T = any> = (target: Constructor<T>) => Constructor<T> | void;

/**
 * Method decorator type
 */
export type MethodDecorator<T = any> = (
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;

/**
 * Property decorator type
 */
export type PropertyDecorator = (target: any, propertyKey: string | symbol) => void;

/**
 * Parameter decorator type
 */
export type ParameterDecorator = (
  target: any,
  propertyKey: string | symbol | undefined,
  parameterIndex: number,
) => void;
