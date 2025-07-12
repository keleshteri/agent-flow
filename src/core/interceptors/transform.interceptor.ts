import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response as ExpressResponse } from 'express';

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
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<ExpressResponse>();

    // Check if transformation should be skipped
    const skipTransform = Reflect.getMetadata('skipTransform', context.getHandler());
    if (skipTransform) {
      return next.handle() as Observable<Response<T>>;
    }

    return next.handle().pipe(
      map((data: unknown) => {
        const typedData = data as T;
        const hasMessage = (obj: unknown): obj is { message?: string } => {
          return typeof obj === 'object' && obj !== null && 'message' in obj;
        };

        const result: Response<T> = {
          data: typedData,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: hasMessage(data) ? (data.message as string) || 'Success' : 'Success',
        };

        return result;
      }),
    );
  }
}
