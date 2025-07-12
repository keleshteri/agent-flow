import { SetMetadata, applyDecorators } from '@nestjs/common';

/**
 * Public route decorator - skips authentication
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * Roles decorator for role-based access control
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * Combined authentication decorator
 */
export const Auth = (...roles: string[]) => {
  return applyDecorators(...(roles.length > 0 ? [Roles(...roles)] : []));
};

/**
 * API Key authentication decorator
 */
export const ApiKeyAuth = () => SetMetadata('isApiKey', true);

/**
 * User decorator to extract user from request
 */
export const CurrentUser = () => SetMetadata('currentUser', true);
