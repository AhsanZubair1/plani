import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Log } from '@src/logging/domain/log';
import { LoggingService } from '@src/logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    const method = request.method;
    const url = request.originalUrl || request.url;
    const userAgent = request.get('User-Agent') || '';
    const ipAddress = this.getClientIp(request);
    const userId = (request as any).user?.id || null;

    // Extract controller and action from context
    const controller = context.getClass().name;
    const action = context.getHandler().name;

    // Get request body immediately
    const requestBody = this.sanitizeRequestBody(request.body);

    // Store original response methods to capture response body
    const originalSend = response.send;
    const originalJson = response.json;
    let responseBody: any = null;

    // Patch response.send
    response.send = function (body: any): any {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // Patch response.json
    response.json = function (body: any): any {
      responseBody = body;
      return originalJson.call(this, body);
    };

    return next.handle().pipe(
      tap((responseData) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = response.statusCode;

        // Use the captured response body or fall back to responseData
        let finalResponseBody =
          responseBody !== null
            ? this.sanitizeResponseBody(responseBody)
            : this.sanitizeResponseBody(responseData);

        // If still null, use a placeholder to ensure something is logged
        if (finalResponseBody === null) {
          finalResponseBody = this.getResponsePlaceholder(
            response,
            responseData,
          );
        }

        // Ensure request body is not null - log at least method and URL info
        const finalRequestBody =
          requestBody !== null
            ? requestBody
            : this.getRequestPlaceholder(request);

        // Log to database asynchronously
        this.logToDatabase({
          method,
          url,
          user_id: userId,
          ip_address: ipAddress,
          user_agent: userAgent,
          status_code: statusCode,
          response_time_ms: responseTime,
          request_body: finalRequestBody,
          response_body: finalResponseBody,
          controller,
          action,
        }).catch((error) => {
          this.logger.error('Failed to log to database:', error);
        });
      }),
      catchError((error) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = error.status || 500;

        // Ensure request body is not null
        const finalRequestBody =
          requestBody !== null
            ? requestBody
            : this.getRequestPlaceholder(request);

        // Log error to database asynchronously
        this.logToDatabase({
          method,
          url,
          user_id: userId,
          ip_address: ipAddress,
          user_agent: userAgent,
          status_code: statusCode,
          response_time_ms: responseTime,
          request_body: finalRequestBody,
          response_body: null,
          error_message: error.message || 'Unknown error',
          controller,
          action,
        }).catch((logError) => {
          this.logger.error('Failed to log error to database:', logError);
        });

        return throwError(() => error);
      }),
    );
  }

  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.ip ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }

  private sanitizeRequestBody(body: any): string | null {
    if (!body || Object.keys(body).length === 0) {
      return null;
    }

    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'refreshToken',
      'accessToken',
      'creditCard',
      'cvv',
      'ssn',
      'cardNumber',
      'expiry',
      'securityCode',
    ];

    const sanitized = this.removeSensitiveFields(body, sensitiveFields);

    // Return null if the sanitized object is empty
    if (Object.keys(sanitized).length === 0) {
      return null;
    }

    return JSON.stringify(sanitized);
  }

  private sanitizeResponseBody(body: any): string | null {
    if (!body) return null;

    try {
      // If it's already a string, try to parse it first
      let parsedBody = body;
      if (typeof body === 'string') {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          // If it's not JSON, use the string as is
          parsedBody = body;
        }
      }

      // Limit response body size to prevent database bloat
      const maxSize = 10000; // 10KB
      const bodyString =
        typeof parsedBody === 'string'
          ? parsedBody
          : JSON.stringify(parsedBody);

      if (bodyString.length > maxSize) {
        return bodyString.substring(0, maxSize) + '... [truncated]';
      }

      return bodyString;
    } catch (error) {
      this.logger.warn('Failed to sanitize response body:', error);
      return '[Unable to parse response body]';
    }
  }

  private removeSensitiveFields(obj: any, sensitiveFields: string[]): any {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        this.removeSensitiveFields(item, sensitiveFields),
      );
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (
        sensitiveFields.some((field) =>
          key.toLowerCase().includes(field.toLowerCase()),
        )
      ) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = this.removeSensitiveFields(value, sensitiveFields);
      }
    }

    return sanitized;
  }

  private getRequestPlaceholder(request: Request): string {
    // Always log at least basic request information
    const basicInfo = {
      method: request.method,
      url: request.url,
      query: request.query,
      params: request.params,
      headers: {
        'content-type': request.get('Content-Type'),
        'user-agent': request.get('User-Agent'),
      },
      hasBody: !!request.body && Object.keys(request.body).length > 0,
      bodyKeys: request.body ? Object.keys(request.body) : [],
    };

    return JSON.stringify(basicInfo);
  }

  private getResponsePlaceholder(
    response: Response,
    responseData: any,
  ): string {
    // Always log at least basic response information
    const basicInfo = {
      statusCode: response.statusCode,
      statusMessage: response.statusMessage,
      headers: {
        'content-type': response.get('Content-Type'),
      },
      hasResponseData: !!responseData,
      responseDataType: typeof responseData,
      responseDataKeys:
        responseData && typeof responseData === 'object'
          ? Object.keys(responseData)
          : [],
    };

    return JSON.stringify(basicInfo);
  }

  private async logToDatabase(
    logData: Omit<Log, 'id' | 'created_at'>,
  ): Promise<void> {
    try {
      // Add debug logging to see what's being stored
      this.logger.debug('Logging to database:', {
        method: logData.method,
        url: logData.url,
        request_body_length: logData.request_body?.length || 0,
        response_body_length: logData.response_body?.length || 0,
        status_code: logData.status_code,
      });

      await this.loggingService.createLog(logData);
    } catch (error) {
      this.logger.error('Failed to create log entry:', error);
    }
  }
}
