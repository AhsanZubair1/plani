import { Injectable, Logger } from '@nestjs/common';

import { AuditService } from '../audit.service';
import { AuditAction, AuditLevel } from '../domain/audit-log';
import { getAuditConfig } from '../config/audit.config';

@Injectable()
export class BulkAuditService {
  private readonly logger = new Logger(BulkAuditService.name);

  constructor(private readonly auditService: AuditService) {}

  async logBulkCreate(
    entities: any[],
    tableName: string,
    context: any,
  ): Promise<void> {
    const config = getAuditConfig();
    if (!config.enabled || !config.logBulkOperations) {
      return;
    }

    try {
      await this.auditService.log(
        AuditAction.BULK_UPDATE, // Using BULK_UPDATE as we don't have BULK_CREATE
        tableName,
        `Bulk created ${entities.length} records in ${tableName}`,
        {
          ...context,
          metadata: {
            ...context.metadata,
            recordCount: entities.length,
            operationType: 'bulk_create',
            entityIds: entities.map((e) => e.id).filter(Boolean),
          },
          tags: ['database', 'bulk_create'],
        },
        {
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log bulk create operation:', error);
    }
  }

  async logBulkUpdate(
    entities: any[],
    tableName: string,
    context: any,
    oldValues?: any[],
  ): Promise<void> {
    const config = getAuditConfig();
    if (!config.enabled || !config.logBulkOperations) {
      return;
    }

    try {
      await this.auditService.log(
        AuditAction.BULK_UPDATE,
        tableName,
        `Bulk updated ${entities.length} records in ${tableName}`,
        {
          ...context,
          metadata: {
            ...context.metadata,
            recordCount: entities.length,
            operationType: 'bulk_update',
            entityIds: entities.map((e) => e.id).filter(Boolean),
            hasOldValues: !!oldValues,
          },
          tags: ['database', 'bulk_update'],
        },
        {
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log bulk update operation:', error);
    }
  }

  async logBulkDelete(
    entities: any[],
    tableName: string,
    context: any,
  ): Promise<void> {
    const config = getAuditConfig();
    if (!config.enabled || !config.logBulkOperations) {
      return;
    }

    try {
      await this.auditService.log(
        AuditAction.BULK_DELETE,
        tableName,
        `Bulk deleted ${entities.length} records from ${tableName}`,
        {
          ...context,
          metadata: {
            ...context.metadata,
            recordCount: entities.length,
            operationType: 'bulk_delete',
            entityIds: entities.map((e) => e.id).filter(Boolean),
          },
          tags: ['database', 'bulk_delete'],
        },
        {
          level: AuditLevel.WARNING,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log bulk delete operation:', error);
    }
  }

  async logBulkRead(
    entities: any[],
    tableName: string,
    context: any,
  ): Promise<void> {
    const config = getAuditConfig();
    if (!config.enabled || !config.logBulkOperations) {
      return;
    }

    try {
      await this.auditService.log(
        AuditAction.READ,
        tableName,
        `Bulk read ${entities.length} records from ${tableName}`,
        {
          ...context,
          metadata: {
            ...context.metadata,
            recordCount: entities.length,
            operationType: 'bulk_read',
            entityIds: entities.map((e) => e.id).filter(Boolean),
          },
          tags: ['database', 'bulk_read'],
        },
        {
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log bulk read operation:', error);
    }
  }
}
