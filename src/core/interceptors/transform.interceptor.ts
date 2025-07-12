import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Decorator to skip response transformation
 */
export const SkipTransform = () => SetMetadata('skipTransform', true);

/**
 * Transform interceptor to standardize API responses
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Check if transformation should be skipped
    const skipTransform = Reflect.getMetadata('skipTransform', context.getHandler());
    if (skipTransform) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: data?.message || 'Success',
      })),
    );
  }
}
