import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from '../audit.service';
import { AuditAction, AuditLevel } from '../domain/audit-log';
import {
  ModelAuditOptions,
  MODEL_AUDIT_KEY,
  AuditCreate,
  AuditRead,
  AuditUpdate,
  AuditDelete,
  AuditBulk,
  AuditSensitive,
} from '../decorators/model-audit.decorator';

@Injectable()
export class ModelAuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ModelAuditInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditOptions = this.reflector.getAllAndOverride<ModelAuditOptions>(
      MODEL_AUDIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const startTime = Date.now();
    const auditContext = this.createAuditContext(request, auditOptions);

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          await this.logAuditEntry(
            auditOptions,
            request,
            response,
            responseData,
            startTime,
            auditContext,
            false,
          );
        } catch (error) {
          this.logger.error('Failed to log audit entry:', error);
        }
      }),
      catchError(async (error) => {
        if (auditOptions.logOnError !== false) {
          try {
            await this.logAuditEntry(
              auditOptions,
              request,
              response,
              null,
              startTime,
              auditContext,
              true,
            );
          } catch (auditError) {
            this.logger.error(
              'Failed to log audit entry for error:',
              auditError,
            );
          }
        }
        throw error;
      }),
    );
  }

  private async logAuditEntry(
    auditOptions: ModelAuditOptions,
    request: any,
    response: any,
    responseData: any,
    startTime: number,
    auditContext: any,
    isError: boolean,
  ): Promise<void> {
    const duration = Date.now() - startTime;

    // Extract resource ID
    const resourceId = this.extractResourceId(
      responseData,
      auditOptions,
      request,
    );

    // Prepare audit data
    const auditData: any = {
      ...auditContext,
      level: isError ? AuditLevel.ERROR : auditOptions.level || AuditLevel.INFO,
      tags: this.buildTags(auditOptions, request, isError),
      metadata: this.buildMetadata(
        auditOptions,
        request,
        responseData,
        duration,
        isError,
      ),
    };

    // Add old and new values for tracking changes
    if (
      auditOptions.trackFieldChanges &&
      auditOptions.action === AuditAction.UPDATE
    ) {
      const { oldValues, newValues } = this.extractFieldChanges(
        request,
        responseData,
        auditOptions,
      );
      auditData.oldValues = oldValues;
      auditData.newValues = newValues;
    }

    // Add request data if requested
    if (auditOptions.includeRequest) {
      auditData.requestData = this.sanitizeRequestData(request, auditOptions);
    }

    // Add response data if requested
    if (auditOptions.includeResponse && responseData) {
      auditData.responseData = this.sanitizeResponseData(
        responseData,
        auditOptions,
      );
    }

    // Log the audit entry
    await this.auditService.log(
      auditOptions.action,
      auditOptions.resource,
      auditOptions.message ||
        this.generateDefaultMessage(auditOptions, resourceId),
      auditData,
      {
        resourceId,
        level: auditData.level,
      },
    );
  }

  private extractResourceId(
    responseData: any,
    auditOptions: ModelAuditOptions,
    request: any,
  ): string | number | undefined {
    // Use custom resource ID extractor if provided
    if (auditOptions.resourceIdExtractor) {
      return auditOptions.resourceIdExtractor(responseData);
    }

    // Use resource ID path if provided
    if (auditOptions.resourceIdPath && responseData) {
      return this.getNestedValue(responseData, auditOptions.resourceIdPath);
    }

    // Try common ID patterns
    if (responseData) {
      const commonIdFields = [
        'id',
        'plan_id',
        'user_id',
        'campaign_id',
        'charge_id',
      ];
      for (const field of commonIdFields) {
        const value =
          responseData[field] ||
          responseData.data?.[field] ||
          responseData.result?.[field];
        if (value !== undefined && value !== null) {
          return value;
        }
      }
    }

    // Try to extract from request params or body
    if (request.params?.id) return request.params.id;
    if (request.body?.id) return request.body.id;

    return undefined;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private extractFieldChanges(
    request: any,
    responseData: any,
    auditOptions: ModelAuditOptions,
  ): { oldValues: any; newValues: any } {
    const oldValues: any = {};
    const newValues: any = {};

    if (!responseData) return { oldValues, newValues };

    // Get the updated entity from response
    const entity = responseData.data || responseData.result || responseData;

    if (!entity || typeof entity !== 'object') {
      return { oldValues, newValues };
    }

    // Get request body for comparison
    const requestBody = request.body || {};

    // Determine which fields to track
    let fieldsToTrack: string[] = [];

    if (auditOptions.includeFields) {
      fieldsToTrack = auditOptions.includeFields;
    } else {
      fieldsToTrack = Object.keys(entity).filter(
        (key) =>
          !auditOptions.excludeFields?.includes(key) &&
          key !== 'id' &&
          key !== 'created_at' &&
          key !== 'updated_at',
      );
    }

    // Extract changes
    fieldsToTrack.forEach((field) => {
      if (
        requestBody[field] !== undefined &&
        entity[field] !== requestBody[field]
      ) {
        oldValues[field] = requestBody[field];
        newValues[field] = entity[field];
      }
    });

    return { oldValues, newValues };
  }

  private buildTags(
    auditOptions: ModelAuditOptions,
    request: any,
    isError: boolean,
  ): string[] {
    const tags = [
      'model_audit',
      auditOptions.resource,
      auditOptions.action.toLowerCase(),
    ];

    if (auditOptions.tags) {
      tags.push(...auditOptions.tags);
    }

    if (isError) {
      tags.push('error');
    }

    // Add HTTP method tag
    if (request.method) {
      tags.push(`method:${request.method.toLowerCase()}`);
    }

    return tags;
  }

  private buildMetadata(
    auditOptions: ModelAuditOptions,
    request: any,
    responseData: any,
    duration: number,
    isError: boolean,
  ): Record<string, any> {
    const metadata: Record<string, any> = {
      source: 'model_audit_interceptor',
      duration,
      timestamp: new Date().toISOString(),
      isError,
      httpMethod: request.method,
      endpoint: request.url,
    };

    if (auditOptions.metadata) {
      Object.assign(metadata, auditOptions.metadata);
    }

    // Add custom metadata from extractor
    if (auditOptions.metadataExtractor) {
      const customMetadata = auditOptions.metadataExtractor(
        request,
        responseData,
      );
      Object.assign(metadata, customMetadata);
    }

    // Add user information if available
    if (request.user) {
      metadata.userId = request.user.id || request.user.userId;
      metadata.userName = request.user.name || request.user.userName;
      metadata.userEmail = request.user.email || request.user.userEmail;
    }

    return metadata;
  }

  private sanitizeRequestData(
    request: any,
    auditOptions: ModelAuditOptions,
  ): any {
    const requestData: any = {};

    if (auditOptions.includeQuery && request.query) {
      requestData.query = request.query;
    }

    if (auditOptions.includeBody && request.body) {
      requestData.body = this.sanitizeSensitiveData(request.body);
    }

    return requestData;
  }

  private sanitizeResponseData(
    responseData: any,
    auditOptions: ModelAuditOptions,
  ): any {
    if (!responseData) return null;

    return this.sanitizeSensitiveData(responseData);
  }

  private sanitizeSensitiveData(data: any): any {
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

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeSensitiveData(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (
        sensitiveFields.some((field) =>
          key.toLowerCase().includes(field.toLowerCase()),
        )
      ) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = this.sanitizeSensitiveData(value);
      }
    }

    return sanitized;
  }

  private generateDefaultMessage(
    auditOptions: ModelAuditOptions,
    resourceId: string | number | undefined,
  ): string {
    const resourceIdStr = resourceId ? ` (ID: ${resourceId})` : '';

    switch (auditOptions.action) {
      case AuditAction.CREATE:
        return `Created ${auditOptions.resource}${resourceIdStr}`;
      case AuditAction.READ:
        return `Read ${auditOptions.resource}${resourceIdStr}`;
      case AuditAction.UPDATE:
        return `Updated ${auditOptions.resource}${resourceIdStr}`;
      case AuditAction.DELETE:
        return `Deleted ${auditOptions.resource}${resourceIdStr}`;
      default:
        return `${auditOptions.action} operation on ${auditOptions.resource}${resourceIdStr}`;
    }
  }

  private createAuditContext(
    request: any,
    auditOptions: ModelAuditOptions,
  ): any {
    return {
      userId: request.user?.id || request.user?.userId || 'anonymous',
      userName: request.user?.name || request.user?.userName || 'Anonymous',
      userEmail:
        request.user?.email ||
        request.user?.userEmail ||
        'anonymous@example.com',
      ipAddress: request.ip || request.connection?.remoteAddress || '127.0.0.1',
      userAgent: request.headers?.['user-agent'] || 'Unknown',
      requestId: request.headers?.['x-request-id'] || undefined,
    };
  }
}
