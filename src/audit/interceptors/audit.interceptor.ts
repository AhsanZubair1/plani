import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { AuditService } from '@src/audit/audit.service';
import { AuditOptions, AUDIT_KEY } from '@src/audit/decorators/audit.decorator';
import { AuditAction, AuditLevel } from '@src/audit/domain/audit-log';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const auditOptions = this.reflector.get<AuditOptions>(
      AUDIT_KEY,
      context.getHandler(),
    );

    if (!auditOptions) {
      return next.handle();
    }

    const startTime = Date.now();
    const requestId = uuidv4();
    const method = request.method;
    const url = request.originalUrl || request.url;

    // Extract user information from request
    const user = (request as any).user;
    const userId = user?.id;
    const userName = user?.name || user?.username;
    const userEmail = user?.email;

    // Prepare audit context
    const auditContext = {
      userId,
      userName,
      userEmail,
      sessionId: (request as any).sessionID,
      ipAddress: this.getClientIp(request),
      userAgent: request.get('User-Agent'),
      requestId,
      method,
      url,
      metadata: {
        ...auditOptions.metadata,
        controller: context.getClass().name,
        method: context.getHandler().name,
      },
      tags: auditOptions.tags,
    };

    // Capture request data if needed
    let requestData: any = {};
    if (auditOptions.includeRequest) {
      requestData = this.captureRequestData(request, auditOptions);
    }

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const endTime = Date.now();
          const responseTime = endTime - startTime;

          // Extract resource ID from response if specified
          let resourceId: string | number | undefined;
          if (auditOptions.resourceIdPath && response) {
            resourceId = this.extractValueFromPath(
              response,
              auditOptions.resourceIdPath,
            );
          }

          // Prepare response data if needed
          let responseData: any = {};
          if (auditOptions.includeResponse) {
            responseData = this.captureResponseData(response, auditOptions);
          }

          // Create audit log
          const message =
            auditOptions.message ||
            this.generateMessage(auditOptions.action, auditOptions.resource);

          await this.auditService.log(
            auditOptions.action,
            auditOptions.resource,
            message,
            {
              ...auditContext,
              responseTime,
              statusCode: 200,
              metadata: {
                ...auditContext.metadata,
                requestData: auditOptions.includeRequest
                  ? requestData
                  : undefined,
                responseData: auditOptions.includeResponse
                  ? responseData
                  : undefined,
              },
            },
            {
              resourceId,
              newValues: responseData,
              level: auditOptions.level || AuditLevel.INFO,
            },
          );
        } catch (error) {
          this.logger.error('Failed to create audit log:', error);
        }
      }),
      catchError(async (error) => {
        try {
          const endTime = Date.now();
          const responseTime = endTime - startTime;

          // Log error audit
          await this.auditService.logError(
            auditOptions.action,
            auditOptions.resource,
            auditOptions.message ||
              this.generateMessage(auditOptions.action, auditOptions.resource),
            error,
            {
              ...auditContext,
              responseTime,
              statusCode: error.status || 500,
            },
          );
        } catch (auditError) {
          this.logger.error('Failed to create error audit log:', auditError);
        }

        throw error;
      }),
    );
  }

  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.ip ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  private captureRequestData(request: Request, options: AuditOptions): any {
    const data: any = {};

    if (options.includeParams && request.params) {
      data.params = request.params;
    }

    if (options.includeQuery && request.query) {
      data.query = request.query;
    }

    if (options.includeBody && request.body) {
      data.body = this.sanitizeData(request.body);
    }

    return data;
  }

  private captureResponseData(response: any, options: AuditOptions): any {
    if (!response) return {};

    // Limit response size to prevent database bloat
    const maxSize = 10000; // 10KB
    const responseString = JSON.stringify(response);

    if (responseString.length > maxSize) {
      return {
        message: 'Response too large, truncated',
        size: responseString.length,
        truncated: true,
      };
    }

    return this.sanitizeData(response);
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') return data;

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

    return this.removeSensitiveFields(data, sensitiveFields);
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

  private extractValueFromPath(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private generateMessage(action: AuditAction, resource: string): string {
    switch (action) {
      case AuditAction.CREATE:
        return `Created ${resource}`;
      case AuditAction.READ:
        return `Read ${resource}`;
      case AuditAction.UPDATE:
        return `Updated ${resource}`;
      case AuditAction.DELETE:
        return `Deleted ${resource}`;
      case AuditAction.LOGIN:
        return `User logged in`;
      case AuditAction.LOGOUT:
        return `User logged out`;
      case AuditAction.EXPORT:
        return `Exported ${resource}`;
      case AuditAction.IMPORT:
        return `Imported ${resource}`;
      case AuditAction.APPROVE:
        return `Approved ${resource}`;
      case AuditAction.REJECT:
        return `Rejected ${resource}`;
      case AuditAction.PUBLISH:
        return `Published ${resource}`;
      case AuditAction.UNPUBLISH:
        return `Unpublished ${resource}`;
      case AuditAction.ARCHIVE:
        return `Archived ${resource}`;
      case AuditAction.RESTORE:
        return `Restored ${resource}`;
      case AuditAction.BULK_UPDATE:
        return `Bulk updated ${resource}`;
      case AuditAction.BULK_DELETE:
        return `Bulk deleted ${resource}`;
      default:
        return `${action} ${resource}`;
    }
  }
}
