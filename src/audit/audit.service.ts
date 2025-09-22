import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { AuditLogAbstractRepository } from './infrastructure/persistence/audit-log.abstract.repository';
import {
  AuditLog,
  AuditLogData,
  AuditAction,
  AuditLevel,
} from './domain/audit-log';

export interface AuditContext {
  userId?: string;
  userName?: string;
  userEmail?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  metadata?: Record<string, any>;
  tags?: string[];
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly auditLogRepository: AuditLogAbstractRepository,
  ) {}

  async log(
    action: AuditAction,
    resource: string,
    message: string,
    context: AuditContext = {},
    options: {
      resourceId?: string | number;
      oldValues?: Record<string, any>;
      newValues?: Record<string, any>;
      level?: AuditLevel;
    } = {},
  ): Promise<AuditLog> {
    try {
      const changes = this.calculateChanges(
        options.oldValues,
        options.newValues,
      );

      const auditLogData: AuditLogData = {
        userId: context.userId,
        userName: context.userName,
        userEmail: context.userEmail,
        sessionId: context.sessionId,
        action,
        resource,
        resourceId: options.resourceId,
        oldValues: options.oldValues,
        newValues: options.newValues,
        changes,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        requestId: context.requestId || uuidv4(),
        method: context.method,
        url: context.url,
        statusCode: context.statusCode,
        responseTime: context.responseTime,
        level: options.level || AuditLevel.INFO,
        message,
        metadata: context.metadata,
        tags: context.tags,
      };

      const auditLog = await this.auditLogRepository.create(auditLogData);

      this.logger.debug(`Audit log created: ${action} on ${resource}`, {
        auditLogId: auditLog.id,
        userId: context.userId,
        resourceId: options.resourceId,
      });

      return auditLog;
    } catch (error) {
      this.logger.error('Failed to create audit log:', error);
      throw error;
    }
  }

  async logFromRequest(
    request: Request,
    action: AuditAction,
    resource: string,
    message: string,
    options: {
      resourceId?: string | number;
      oldValues?: Record<string, any>;
      newValues?: Record<string, any>;
      level?: AuditLevel;
      userId?: string;
      userName?: string;
      userEmail?: string;
      sessionId?: string;
      metadata?: Record<string, any>;
      tags?: string[];
    } = {},
  ): Promise<AuditLog> {
    const context: AuditContext = {
      userId: options.userId || (request as any).user?.id,
      userName: options.userName || (request as any).user?.name,
      userEmail: options.userEmail || (request as any).user?.email,
      sessionId: options.sessionId || (request as any).sessionID,
      ipAddress: this.getClientIp(request),
      userAgent: request.get('User-Agent'),
      method: request.method,
      url: request.originalUrl || request.url,
      metadata: options.metadata,
      tags: options.tags,
    };

    return this.log(action, resource, message, context, {
      resourceId: options.resourceId,
      oldValues: options.oldValues,
      newValues: options.newValues,
      level: options.level,
    });
  }

  async logCreate(
    resource: string,
    newValues: Record<string, any>,
    context: AuditContext,
    resourceId?: string | number,
  ): Promise<AuditLog> {
    return this.log(
      AuditAction.CREATE,
      resource,
      `Created ${resource}`,
      context,
      {
        resourceId,
        newValues,
        level: AuditLevel.INFO,
      },
    );
  }

  async logUpdate(
    resource: string,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
    context: AuditContext,
    resourceId?: string | number,
  ): Promise<AuditLog> {
    return this.log(
      AuditAction.UPDATE,
      resource,
      `Updated ${resource}`,
      context,
      {
        resourceId,
        oldValues,
        newValues,
        level: AuditLevel.INFO,
      },
    );
  }

  async logDelete(
    resource: string,
    oldValues: Record<string, any>,
    context: AuditContext,
    resourceId?: string | number,
  ): Promise<AuditLog> {
    return this.log(
      AuditAction.DELETE,
      resource,
      `Deleted ${resource}`,
      context,
      {
        resourceId,
        oldValues,
        level: AuditLevel.WARNING,
      },
    );
  }

  async logRead(
    resource: string,
    context: AuditContext,
    resourceId?: string | number,
  ): Promise<AuditLog> {
    return this.log(AuditAction.READ, resource, `Read ${resource}`, context, {
      resourceId,
      level: AuditLevel.INFO,
    });
  }

  async logLogin(
    userId: string,
    userName: string,
    userEmail: string,
    context: AuditContext,
  ): Promise<AuditLog> {
    return this.log(
      AuditAction.LOGIN,
      'User',
      `User ${userName} logged in`,
      {
        ...context,
        userId,
        userName,
        userEmail,
        tags: ['authentication', 'login'],
      },
      {
        resourceId: userId,
        level: AuditLevel.INFO,
      },
    );
  }

  async logLogout(
    userId: string,
    userName: string,
    context: AuditContext,
  ): Promise<AuditLog> {
    return this.log(
      AuditAction.LOGOUT,
      'User',
      `User ${userName} logged out`,
      { ...context, userId, userName, tags: ['authentication', 'logout'] },
      {
        resourceId: userId,
        level: AuditLevel.INFO,
      },
    );
  }

  async logError(
    action: AuditAction,
    resource: string,
    message: string,
    error: Error,
    context: AuditContext,
    resourceId?: string | number,
  ): Promise<AuditLog> {
    return this.log(
      action,
      resource,
      `${message}: ${error.message}`,
      {
        ...context,
        metadata: {
          ...context.metadata,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        },
        tags: ['error'],
      },
      {
        resourceId,
        level: AuditLevel.ERROR,
      },
    );
  }

  async getAuditLogById(id: number): Promise<AuditLog | null> {
    return this.auditLogRepository.findById(id);
  }

  async getAuditTrail(
    resource: string,
    resourceId?: string | number,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.findByResource(
      resource,
      resourceId,
      limit,
      offset,
    );
  }

  async getUserActivity(
    userId: string,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUserId(userId, limit, offset);
  }

  async searchAuditLogs(query: {
    userId?: string;
    resource?: string;
    action?: string;
    level?: string;
    startDate?: Date;
    endDate?: Date;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    return this.auditLogRepository.search(query);
  }

  async getAuditStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalLogs: number;
    logsByAction: Record<string, number>;
    logsByLevel: Record<string, number>;
    logsByResource: Record<string, number>;
    logsByUser: Record<string, number>;
  }> {
    return this.auditLogRepository.getAuditStats(startDate, endDate);
  }

  async exportAuditLogs(query: {
    userId?: string;
    resource?: string;
    action?: string;
    level?: string;
    startDate?: Date;
    endDate?: Date;
    format?: 'json' | 'csv';
  }): Promise<Buffer> {
    return this.auditLogRepository.exportLogs(query);
  }

  async cleanupOldLogs(retentionDays = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const deletedCount =
      await this.auditLogRepository.deleteOldLogs(cutoffDate);

    this.logger.log(
      `Cleaned up ${deletedCount} audit logs older than ${retentionDays} days`,
    );

    return deletedCount;
  }

  private calculateChanges(
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ): Record<string, { old: any; new: any }> | undefined {
    if (!oldValues || !newValues) {
      return undefined;
    }

    const changes: Record<string, { old: any; new: any }> = {};
    const allKeys = new Set([
      ...Object.keys(oldValues),
      ...Object.keys(newValues),
    ]);

    for (const key of allKeys) {
      const oldValue = oldValues[key];
      const newValue = newValues[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes[key] = { old: oldValue, new: newValue };
      }
    }

    return Object.keys(changes).length > 0 ? changes : undefined;
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
}
