import { Injectable, Logger } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  LoadEvent,
} from 'typeorm';

import { AuditService } from '@src/audit/audit.service';
import { getAuditConfig } from '@src/audit/config/audit.config';
import { AuditAction, AuditLevel } from '@src/audit/domain/audit-log';

export interface AuditableEntity {
  id?: number | string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
}

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(AuditSubscriber.name);
  private readonly auditableEntities = new Set<string>([
    'plans',
    'users',
    'campaigns',
    'charges',
    'rates',
    'retail_tariffs',
    'network_tariffs',
    'distributors',
    'states',
    'zones',
    'postcodes',
    'climate_zones',
    'contract_terms',
    'frequencies',
    'plan_types',
    'customer_types',
    'tariff_types',
    'fuel_types',
    'rate_cards',
    'rate_categories',
    'rate_seasons',
    'rate_items',
    'rate_item_timings',
    'rate_item_blocks',
    'rate_item_demands',
    'billing_codes',
    'billing_code_types',
    'charge_types',
    'charge_categories',
    'charge_terms',
    'incentives',
    'incentive_types',
    'incentive_categories',
    'campaign_statuses',
    'channels',
    'campaign_channel_relns',
    'campaign_plan_relns',
    'plan_status',
    'retailers',
    'plan_bundles',
    'exclusive_channels',
    'reference_price_templates',
    'benchmark_data',
  ]);

  constructor(
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {
    // Register the subscriber
    this.dataSource.subscribers.push(this);
    this.logger.log('Audit subscriber registered successfully');
  }

  afterLoad(entity: any, event: LoadEvent<any>): void | Promise<any> {
    const config = getAuditConfig();
    if (
      config.enabled &&
      config.logReads &&
      this.isAuditableEntity(event.entity) &&
      this.shouldLogReadOperation(event)
    ) {
      this.logReadOperation(event.entity, event.metadata.tableName).catch(
        (error) => {
          this.logger.error('Failed to log read operation:', error);
        },
      );
    }
  }

  // Log raw SQL queries (disabled for performance - only log actual CRUD operations)
  beforeQuery(_event: any): void | Promise<any> {
    // Disabled - we only want to log actual CRUD operations, not all queries
    // const config = getAuditConfig();
    // if (config.enabled && this.shouldLogRawQuery(event)) {
    //   this.logRawQuery(event).catch((error) => {
    //     this.logger.error('Failed to log raw query:', error);
    //   });
    // }
  }

  // Log bulk operations for read operations
  afterLoadMany(entities: any[], event: LoadEvent<any>): void | Promise<any> {
    const config = getAuditConfig();
    if (
      config.enabled &&
      config.logReads &&
      entities.length > 0 &&
      this.isAuditableEntity(entities[0])
    ) {
      this.logBulkReadOperation(entities, event.metadata.tableName).catch(
        (error) => {
          this.logger.error('Failed to log bulk read operation:', error);
        },
      );
    }
  }

  afterInsert(event: InsertEvent<any>): void | Promise<any> {
    const config = getAuditConfig();
    if (
      config.enabled &&
      config.logWrites &&
      this.isAuditableEntity(event.entity)
    ) {
      this.logCreateOperation(event.entity, event.metadata.tableName).catch(
        (error) => {
          this.logger.error('Failed to log create operation:', error);
        },
      );
    }
  }

  afterUpdate(event: UpdateEvent<any>): void | Promise<any> {
    const config = getAuditConfig();
    if (
      config.enabled &&
      config.logWrites &&
      this.isAuditableEntity(event.entity)
    ) {
      this.logUpdateOperation(
        event.entity,
        event.databaseEntity,
        event.metadata.tableName,
      ).catch((error) => {
        this.logger.error('Failed to log update operation:', error);
      });
    }
  }

  afterRemove(event: RemoveEvent<any>): void | Promise<any> {
    const config = getAuditConfig();
    if (
      config.enabled &&
      config.logDeletes &&
      this.isAuditableEntity(event.entity)
    ) {
      this.logDeleteOperation(event.entity, event.metadata.tableName).catch(
        (error) => {
          this.logger.error('Failed to log delete operation:', error);
        },
      );
    }
  }

  private isAuditableEntity(entity: any): boolean {
    if (!entity) {
      return false;
    }

    // Check if entity has an ID (indicating it's a database entity)
    const hasId = entity.id !== undefined && entity.id !== null;

    // Check if it's in our auditable entities list
    const entityName = entity.constructor.name.toLowerCase();
    const isAuditable =
      this.auditableEntities.has(entityName) ||
      this.auditableEntities.has(entityName.replace('entity', ''));

    return hasId && isAuditable;
  }

  private shouldLogReadOperation(event: LoadEvent<any>): boolean {
    const config = getAuditConfig();

    // Check if audit is enabled
    if (!config.enabled) {
      return false;
    }

    const entityName = event.metadata.tableName.toLowerCase();

    // Check if entity is excluded
    if (config.excludedEntities.includes(entityName)) {
      return false;
    }

    // Always log reads for sensitive entities (regardless of logReads setting)
    if (config.sensitiveEntities.includes(entityName)) {
      return true;
    }

    // For other entities, only log if explicitly enabled
    return config.logReads;
  }

  private shouldLogRawQuery(event: any): boolean {
    const config = getAuditConfig();

    // Check if raw query logging is enabled
    if (!config.enabled || !config.logRawQueries) {
      return false;
    }

    // Extract table name from SQL query if possible
    const sql = event.query || '';
    const tableName = this.extractTableNameFromSQL(sql);

    if (tableName) {
      // Check if entity is excluded
      if (config.excludedEntities.includes(tableName.toLowerCase())) {
        return false;
      }

      // Always log raw queries for sensitive entities
      if (config.sensitiveEntities.includes(tableName.toLowerCase())) {
        return true;
      }
    }

    // Log all raw queries if enabled
    return config.logRawQueries;
  }

  private extractTableNameFromSQL(sql: string): string | null {
    // Simple regex to extract table name from SELECT, INSERT, UPDATE, DELETE
    const patterns = [
      /FROM\s+(\w+)/i,
      /INTO\s+(\w+)/i,
      /UPDATE\s+(\w+)/i,
      /DELETE\s+FROM\s+(\w+)/i,
    ];

    for (const pattern of patterns) {
      const match = sql.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  private async logReadOperation(
    entity: any,
    tableName: string,
  ): Promise<void> {
    try {
      const resourceId = this.extractResourceId(entity);
      const context = this.createAuditContext();

      await this.auditService.log(
        AuditAction.READ,
        tableName,
        `Read ${tableName}`,
        { ...context, tags: ['database', 'read'] },
        {
          resourceId,
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log read operation:', error);
    }
  }

  private async logCreateOperation(
    entity: any,
    tableName: string,
  ): Promise<void> {
    try {
      const resourceId = this.extractResourceId(entity);
      const newValues = this.sanitizeEntityData(entity);
      const context = this.createAuditContext();

      await this.auditService.log(
        AuditAction.CREATE,
        tableName,
        `Created ${tableName}`,
        { ...context, tags: ['database', 'create'] },
        {
          resourceId,
          newValues,
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log create operation:', error);
    }
  }

  private async logUpdateOperation(
    entity: any,
    databaseEntity: any,
    tableName: string,
  ): Promise<void> {
    try {
      const resourceId = this.extractResourceId(entity);
      const oldValues = this.sanitizeEntityData(databaseEntity);
      const newValues = this.sanitizeEntityData(entity);
      const context = this.createAuditContext();

      await this.auditService.log(
        AuditAction.UPDATE,
        tableName,
        `Updated ${tableName}`,
        { ...context, tags: ['database', 'update'] },
        {
          resourceId,
          oldValues,
          newValues,
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log update operation:', error);
    }
  }

  private async logDeleteOperation(
    entity: any,
    tableName: string,
  ): Promise<void> {
    try {
      const resourceId = this.extractResourceId(entity);
      const oldValues = this.sanitizeEntityData(entity);
      const context = this.createAuditContext();

      await this.auditService.log(
        AuditAction.DELETE,
        tableName,
        `Deleted ${tableName}`,
        { ...context, tags: ['database', 'delete'] },
        {
          resourceId,
          oldValues,
          level: AuditLevel.WARNING,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log delete operation:', error);
    }
  }

  private async logRawQuery(event: any): Promise<void> {
    try {
      const sql = event.query || '';
      const tableName = this.extractTableNameFromSQL(sql) || 'unknown';
      const context = this.createAuditContext();

      // Determine action type from SQL
      const action = this.getActionFromSQL(sql);

      await this.auditService.log(
        action,
        tableName,
        `Raw SQL query executed`,
        {
          ...context,
          metadata: {
            ...context.metadata,
            sql: this.sanitizeSQL(sql),
            queryType: 'raw_sql',
            executionTime: event.duration || 0,
          },
          tags: ['database', 'raw_sql', action.toLowerCase()],
        },
        {
          level: AuditLevel.INFO,
        },
      );
    } catch (error) {
      this.logger.error('Failed to log raw query:', error);
    }
  }

  private async logBulkReadOperation(
    entities: any[],
    tableName: string,
  ): Promise<void> {
    try {
      const context = this.createAuditContext();

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

  private extractResourceId(entity: any): string | number | undefined {
    if (entity.id !== undefined && entity.id !== null) {
      return entity.id;
    }

    // Try common ID field names
    const idFields = ['id', 'plan_id', 'user_id', 'campaign_id', 'charge_id'];
    for (const field of idFields) {
      if (entity[field] !== undefined && entity[field] !== null) {
        return entity[field];
      }
    }

    return undefined;
  }

  private sanitizeEntityData(entity: any): Record<string, any> {
    if (!entity || typeof entity !== 'object') {
      return {};
    }

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

    return this.removeSensitiveFields(entity, sensitiveFields);
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

  private getActionFromSQL(sql: string): AuditAction {
    const upperSQL = sql.toUpperCase().trim();

    if (upperSQL.startsWith('SELECT')) {
      return AuditAction.READ;
    } else if (upperSQL.startsWith('INSERT')) {
      return AuditAction.CREATE;
    } else if (upperSQL.startsWith('UPDATE')) {
      return AuditAction.UPDATE;
    } else if (upperSQL.startsWith('DELETE')) {
      return AuditAction.DELETE;
    } else {
      return AuditAction.CUSTOM;
    }
  }

  private sanitizeSQL(sql: string): string {
    // Remove sensitive data from SQL queries
    const sensitivePatterns = [
      /password\s*=\s*'[^']*'/gi,
      /token\s*=\s*'[^']*'/gi,
      /secret\s*=\s*'[^']*'/gi,
      /key\s*=\s*'[^']*'/gi,
    ];

    let sanitizedSQL = sql;
    sensitivePatterns.forEach((pattern) => {
      sanitizedSQL = sanitizedSQL.replace(pattern, (match) => {
        const key = match.split('=')[0].trim();
        return `${key} = '[REDACTED]'`;
      });
    });

    // Limit SQL length to prevent database bloat
    const maxLength = 2000;
    if (sanitizedSQL.length > maxLength) {
      return sanitizedSQL.substring(0, maxLength) + '... [truncated]';
    }

    return sanitizedSQL;
  }

  private createAuditContext() {
    // In a real application, you would get this from the current request context
    // For now, we'll create a basic context
    return {
      userId: 'system',
      userName: 'System',
      userEmail: 'system@example.com',
      ipAddress: '127.0.0.1',
      userAgent: 'TypeORM Subscriber',
      metadata: {
        source: 'database_subscriber',
        timestamp: new Date().toISOString(),
      },
      tags: ['database', 'subscriber'],
    };
  }
}
