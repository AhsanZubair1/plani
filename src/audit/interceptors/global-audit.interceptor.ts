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

import { AuditService } from '../audit.service';
import { AuditAction, AuditLevel } from '../domain/audit-log';

@Injectable()
export class GlobalAuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GlobalAuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const startTime = Date.now();

    // Skip audit logging for certain paths
    if (this.shouldSkipAudit(request)) {
      return next.handle();
    }

    const requestId = uuidv4();
    const method = request.method;
    const url = request.originalUrl || request.url;

    // Extract user information from request
    const user = (request as any).user;
    const userId = user?.id;
    const userName = user?.name || user?.username;
    const userEmail = user?.email;

    // Determine action based on HTTP method
    const action = this.getActionFromMethod(method);
    const resource = this.getResourceFromPath(url);

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const endTime = Date.now();
          const responseTime = endTime - startTime;

          await this.auditService.log(
            action,
            resource,
            `${method} ${url}`,
            {
              userId,
              userName,
              userEmail,
              sessionId: (request as any).sessionID,
              ipAddress: this.getClientIp(request),
              userAgent: request.get('User-Agent'),
              requestId,
              method,
              url,
              statusCode: 200,
              responseTime,
              metadata: {
                controller: context.getClass().name,
                method: context.getHandler().name,
                responseSize: this.getResponseSize(response),
              },
              tags: ['api', 'request'],
            },
            {
              level: AuditLevel.INFO,
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

          await this.auditService.logError(
            action,
            resource,
            `${method} ${url}`,
            error,
            {
              userId,
              userName,
              userEmail,
              sessionId: (request as any).sessionID,
              ipAddress: this.getClientIp(request),
              userAgent: request.get('User-Agent'),
              requestId,
              method,
              url,
              statusCode: error.status || 500,
              responseTime,
              metadata: {
                controller: context.getClass().name,
                method: context.getHandler().name,
                error: {
                  name: error.name,
                  message: error.message,
                },
              },
              tags: ['api', 'error'],
            },
          );
        } catch (auditError) {
          this.logger.error('Failed to create error audit log:', auditError);
        }

        throw error;
      }),
    );
  }

  private shouldSkipAudit(request: Request): boolean {
    const skipPaths = [
      '/health',
      '/metrics',
      '/favicon.ico',
      '/swagger',
      '/api-docs',
      '/audit', // Skip audit logs themselves to prevent recursion
    ];

    const path = request.originalUrl || request.url;
    return skipPaths.some((skipPath) => path.startsWith(skipPath));
  }

  private getActionFromMethod(method: string): AuditAction {
    switch (method.toUpperCase()) {
      case 'GET':
        return AuditAction.READ;
      case 'POST':
        return AuditAction.CREATE;
      case 'PUT':
      case 'PATCH':
        return AuditAction.UPDATE;
      case 'DELETE':
        return AuditAction.DELETE;
      default:
        return AuditAction.CUSTOM;
    }
  }

  private getResourceFromPath(path: string): string {
    // Extract resource from path like /api/plans -> plans
    const pathParts = path.split('/').filter((part) => part && part !== 'api');
    return pathParts[0] || 'unknown';
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

  private getResponseSize(response: any): number {
    if (!response) return 0;

    try {
      const responseString = JSON.stringify(response);
      return Buffer.byteLength(responseString, 'utf8');
    } catch {
      return 0;
    }
  }
}
