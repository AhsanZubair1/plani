import { AuditLog, AuditLogData } from '../../domain/audit-log';

export abstract class AuditLogAbstractRepository {
  abstract create(auditLogData: AuditLogData): Promise<AuditLog>;
  abstract findById(id: number): Promise<AuditLog | null>;
  abstract findByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<AuditLog[]>;
  abstract findByResource(
    resource: string,
    resourceId?: string | number,
    limit?: number,
    offset?: number,
  ): Promise<AuditLog[]>;
  abstract findByAction(
    action: string,
    limit?: number,
    offset?: number,
  ): Promise<AuditLog[]>;
  abstract findByDateRange(
    startDate: Date,
    endDate: Date,
    limit?: number,
    offset?: number,
  ): Promise<AuditLog[]>;
  abstract findByLevel(
    level: string,
    limit?: number,
    offset?: number,
  ): Promise<AuditLog[]>;
  abstract findBySessionId(
    sessionId: string,
    limit?: number,
    offset?: number,
  ): Promise<AuditLog[]>;
  abstract findByRequestId(requestId: string): Promise<AuditLog[]>;
  abstract search(query: {
    userId?: string;
    resource?: string;
    action?: string;
    level?: string;
    startDate?: Date;
    endDate?: Date;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }>;
  abstract getAuditStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalLogs: number;
    logsByAction: Record<string, number>;
    logsByLevel: Record<string, number>;
    logsByResource: Record<string, number>;
    logsByUser: Record<string, number>;
  }>;
  abstract deleteOldLogs(olderThan: Date): Promise<number>;
  abstract exportLogs(query: {
    userId?: string;
    resource?: string;
    action?: string;
    level?: string;
    startDate?: Date;
    endDate?: Date;
    format?: 'json' | 'csv';
  }): Promise<Buffer>;
}
