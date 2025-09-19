import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { AuditLogEntity } from '../infrastructure/persistence/relational/entities/audit-log.entity';
import { AuditAction, AuditLevel } from '../domain/audit-log';

@Injectable()
export class DatabaseAuditInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Extract request information
    const { method, url, headers, body, query, params, user } = request;

    // Determine the action based on HTTP method
    const action = this.getActionFromMethod(method);
    const resource = this.extractResourceFromUrl(url);
    const resourceId = this.extractResourceId(params);

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          // Fire and forget - don't await to avoid blocking
          this.logDatabaseOperationAsync({
            action,
            resource,
            resourceId,
            method,
            url,
            endpoint: `${method} ${url}`,
            query: this.sanitizeQuery(query),
            requestBody: this.sanitizeBody(body),
            responseData: this.sanitizeResponse(responseData),
            statusCode: response.statusCode,
            duration,
            userAgent: headers['user-agent'] || 'unknown',
            ip: this.getClientIp(request),
            userId: this.extractUserId(user),
            userName: this.extractUserName(user),
            timestamp: new Date(),
          }).catch((error) => {
            console.error('Failed to log database operation:', error);
          });
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          // Fire and forget - don't await to avoid blocking
          this.logDatabaseOperationAsync({
            action,
            resource,
            resourceId,
            method,
            url,
            endpoint: `${method} ${url}`,
            query: this.sanitizeQuery(query),
            requestBody: this.sanitizeBody(body),
            responseData: { error: error.message, stack: error.stack },
            statusCode: error.status || 500,
            duration,
            userAgent: headers['user-agent'] || 'unknown',
            ip: this.getClientIp(request),
            userId: this.extractUserId(user),
            userName: this.extractUserName(user),
            timestamp: new Date(),
            isError: true,
          }).catch((logError) => {
            console.error('Failed to log database operation error:', logError);
          });
        },
      }),
    );
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
        return AuditAction.READ;
    }
  }

  private extractResourceFromUrl(url: string): string {
    // Extract resource from URL path
    const pathSegments = url.split('/').filter((segment) => segment);

    // Skip 'api' and version segments
    const resourceIndex = pathSegments.findIndex(
      (segment) => !['api', 'v1', 'v2'].includes(segment),
    );

    if (resourceIndex !== -1) {
      return pathSegments[resourceIndex];
    }

    return 'unknown';
  }

  private extractResourceId(params: any): string | null {
    // Try to extract ID from common parameter names
    const idFields = ['id', 'resourceId', 'entityId'];
    for (const field of idFields) {
      if (params[field]) {
        return params[field].toString();
      }
    }
    return null;
  }

  private sanitizeQuery(query: any): any {
    if (!query) return null;

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...query };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeResponse(responseData: any): any {
    if (!responseData) return null;

    // Limit response size to prevent huge logs
    const maxSize = 10000; // 10KB
    const responseStr = JSON.stringify(responseData);

    if (responseStr.length > maxSize) {
      return {
        truncated: true,
        size: responseStr.length,
        preview: responseStr.substring(0, maxSize) + '...',
      };
    }

    return responseData;
  }

  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string) ||
      (request.headers['x-real-ip'] as string) ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  private extractUserId(user: any): string | undefined {
    if (!user) return undefined;
    return user.id || user.userId || user.sub || user.user_id;
  }

  private extractUserName(user: any): string | undefined {
    if (!user) return undefined;
    return (
      user.name ||
      user.userName ||
      user.username ||
      user.email ||
      user.displayName
    );
  }

  private async logDatabaseOperationAsync(data: {
    action: AuditAction;
    resource: string;
    resourceId: string | null;
    method: string;
    url: string;
    endpoint: string;
    query: any;
    requestBody: any;
    responseData: any;
    statusCode: number;
    duration: number;
    userAgent: string;
    ip: string;
    userId?: string;
    userName?: string;
    timestamp: Date;
    isError?: boolean;
  }): Promise<void> {
    try {
      const auditLog = new AuditLogEntity();
      (auditLog as any).userId = data.userId || null;
      (auditLog as any).userName = data.userName || null;
      auditLog.action = data.action;
      auditLog.resource = data.resource;
      (auditLog as any).resourceId = data.resourceId || null;
      (auditLog as any).oldValues = null;
      auditLog.newValues = data.requestBody;
      auditLog.changes = {
        endpoint: { old: null, new: data.endpoint },
        method: { old: null, new: data.method },
        url: { old: null, new: data.url },
        query: { old: null, new: data.query },
        response: { old: null, new: data.responseData },
        statusCode: { old: null, new: data.statusCode },
        duration: { old: null, new: data.duration },
        userAgent: { old: null, new: data.userAgent },
        ip: { old: null, new: data.ip },
        timestamp: { old: null, new: data.timestamp },
      };
      auditLog.method = data.method;
      auditLog.url = data.url;
      auditLog.statusCode = data.statusCode;
      auditLog.responseTime = data.duration;
      auditLog.userAgent = data.userAgent;
      auditLog.ipAddress = data.ip;
      auditLog.level = data.isError ? AuditLevel.ERROR : AuditLevel.INFO;
      auditLog.message = `${data.action} operation on ${data.resource} via ${data.endpoint}`;
      auditLog.tags = `database,${data.resource},${data.method.toLowerCase()}`;
      auditLog.metadata = {
        duration: data.duration,
        statusCode: data.statusCode,
        userAgent: data.userAgent,
        ipAddress: data.ip,
        isError: data.isError || false,
      };
      auditLog.createdAt = data.timestamp;

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      // Log error but don't throw to avoid breaking the main request
      console.error('Failed to save audit log:', error);
    }
  }
}
