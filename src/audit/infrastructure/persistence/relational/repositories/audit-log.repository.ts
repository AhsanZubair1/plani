import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, Like } from 'typeorm';

import { AuditLogAbstractRepository } from '../../audit-log.abstract.repository';
import { AuditLogEntity } from '../entities/audit-log.entity';
import {
  AuditLog,
  AuditLogData,
  AuditAction,
  AuditLevel,
} from '../../../../domain/audit-log';

@Injectable()
export class AuditLogRepository extends AuditLogAbstractRepository {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {
    super();
  }

  async create(auditLogData: AuditLogData): Promise<AuditLog> {
    const entity = this.auditLogRepository.create({
      userId: auditLogData.userId,
      userName: auditLogData.userName,
      userEmail: auditLogData.userEmail,
      sessionId: auditLogData.sessionId,
      action: auditLogData.action,
      resource: auditLogData.resource,
      resourceId: auditLogData.resourceId?.toString(),
      oldValues: auditLogData.oldValues,
      newValues: auditLogData.newValues,
      changes: auditLogData.changes,
      ipAddress: auditLogData.ipAddress,
      userAgent: auditLogData.userAgent,
      requestId: auditLogData.requestId,
      method: auditLogData.method,
      url: auditLogData.url,
      statusCode: auditLogData.statusCode,
      responseTime: auditLogData.responseTime,
      level: auditLogData.level,
      message: auditLogData.message,
      metadata: auditLogData.metadata,
      tags: auditLogData.tags?.join(','),
    });

    const savedEntity = await this.auditLogRepository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: number): Promise<AuditLog | null> {
    const entity = await this.auditLogRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(
    userId: string,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    const entities = await this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByResource(
    resource: string,
    resourceId?: string | number,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    const where: any = { resource };
    if (resourceId) {
      where.resourceId = resourceId.toString();
    }

    const entities = await this.auditLogRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByAction(
    action: string,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    const entities = await this.auditLogRepository.find({
      where: { action },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    const entities = await this.auditLogRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByLevel(
    level: string,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    const entities = await this.auditLogRepository.find({
      where: { level },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findBySessionId(
    sessionId: string,
    limit = 100,
    offset = 0,
  ): Promise<AuditLog[]> {
    const entities = await this.auditLogRepository.find({
      where: { sessionId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByRequestId(requestId: string): Promise<AuditLog[]> {
    const entities = await this.auditLogRepository.find({
      where: { requestId },
      order: { createdAt: 'ASC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async search(query: {
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
    const queryBuilder =
      this.auditLogRepository.createQueryBuilder('audit_log');

    if (query.userId) {
      queryBuilder.andWhere('audit_log.userId = :userId', {
        userId: query.userId,
      });
    }

    if (query.resource) {
      queryBuilder.andWhere('audit_log.resource = :resource', {
        resource: query.resource,
      });
    }

    if (query.action) {
      queryBuilder.andWhere('audit_log.action = :action', {
        action: query.action,
      });
    }

    if (query.level) {
      queryBuilder.andWhere('audit_log.level = :level', { level: query.level });
    }

    if (query.startDate && query.endDate) {
      queryBuilder.andWhere(
        'audit_log.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate: query.startDate,
          endDate: query.endDate,
        },
      );
    }

    if (query.tags && query.tags.length > 0) {
      const tagConditions = query.tags
        .map((_, index) => `audit_log.tags LIKE :tag${index}`)
        .join(' OR ');
      queryBuilder.andWhere(`(${tagConditions})`);
      query.tags.forEach((tag, index) => {
        queryBuilder.setParameter(`tag${index}`, `%${tag}%`);
      });
    }

    const total = await queryBuilder.getCount();

    const entities = await queryBuilder
      .orderBy('audit_log.createdAt', 'DESC')
      .take(query.limit || 100)
      .skip(query.offset || 0)
      .getMany();

    return {
      logs: entities.map((entity) => this.toDomain(entity)),
      total,
    };
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
    const queryBuilder =
      this.auditLogRepository.createQueryBuilder('audit_log');

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'audit_log.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    const totalLogs = await queryBuilder.getCount();

    // Get logs by action
    const logsByAction = await this.auditLogRepository
      .createQueryBuilder('audit_log')
      .select('audit_log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit_log.action')
      .getRawMany();

    // Get logs by level
    const logsByLevel = await this.auditLogRepository
      .createQueryBuilder('audit_log')
      .select('audit_log.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit_log.level')
      .getRawMany();

    // Get logs by resource
    const logsByResource = await this.auditLogRepository
      .createQueryBuilder('audit_log')
      .select('audit_log.resource', 'resource')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit_log.resource')
      .getRawMany();

    // Get logs by user
    const logsByUser = await this.auditLogRepository
      .createQueryBuilder('audit_log')
      .select('audit_log.userId', 'userId')
      .addSelect('COUNT(*)', 'count')
      .where('audit_log.userId IS NOT NULL')
      .groupBy('audit_log.userId')
      .getRawMany();

    return {
      totalLogs,
      logsByAction: logsByAction.reduce(
        (acc, item) => {
          acc[item.action] = parseInt(item.count);
          return acc;
        },
        {} as Record<string, number>,
      ),
      logsByLevel: logsByLevel.reduce(
        (acc, item) => {
          acc[item.level] = parseInt(item.count);
          return acc;
        },
        {} as Record<string, number>,
      ),
      logsByResource: logsByResource.reduce(
        (acc, item) => {
          acc[item.resource] = parseInt(item.count);
          return acc;
        },
        {} as Record<string, number>,
      ),
      logsByUser: logsByUser.reduce(
        (acc, item) => {
          acc[item.userId] = parseInt(item.count);
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async deleteOldLogs(olderThan: Date): Promise<number> {
    const result = await this.auditLogRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :olderThan', { olderThan })
      .execute();

    return result.affected || 0;
  }

  async exportLogs(query: {
    userId?: string;
    resource?: string;
    action?: string;
    level?: string;
    startDate?: Date;
    endDate?: Date;
    format?: 'json' | 'csv';
  }): Promise<Buffer> {
    const searchResult = await this.search({
      userId: query.userId,
      resource: query.resource,
      action: query.action,
      level: query.level,
      startDate: query.startDate,
      endDate: query.endDate,
      limit: 10000, // Export limit
    });

    if (query.format === 'csv') {
      return this.exportToCSV(searchResult.logs);
    } else {
      return this.exportToJSON(searchResult.logs);
    }
  }

  private exportToCSV(logs: AuditLog[]): Buffer {
    const headers = [
      'ID',
      'User ID',
      'User Name',
      'User Email',
      'Session ID',
      'Action',
      'Resource',
      'Resource ID',
      'IP Address',
      'User Agent',
      'Request ID',
      'Method',
      'URL',
      'Status Code',
      'Response Time',
      'Level',
      'Message',
      'Tags',
      'Created At',
    ];

    const rows = logs.map((log) => [
      log.id,
      log.userId || '',
      log.userName || '',
      log.userEmail || '',
      log.sessionId || '',
      log.action,
      log.resource,
      log.resourceId || '',
      log.ipAddress || '',
      log.userAgent || '',
      log.requestId || '',
      log.method || '',
      log.url || '',
      log.statusCode || '',
      log.responseTime || '',
      log.level,
      log.message,
      log.tags?.join(',') || '',
      log.createdAt.toISOString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    return Buffer.from(csvContent, 'utf-8');
  }

  private exportToJSON(logs: AuditLog[]): Buffer {
    const jsonContent = JSON.stringify(
      logs.map((log) => log.toJSON()),
      null,
      2,
    );
    return Buffer.from(jsonContent, 'utf-8');
  }

  private toDomain(entity: AuditLogEntity): AuditLog {
    return AuditLog.create({
      id: entity.id,
      userId: entity.userId,
      userName: entity.userName,
      userEmail: entity.userEmail,
      sessionId: entity.sessionId,
      action: entity.action as AuditAction,
      resource: entity.resource,
      resourceId: entity.resourceId,
      oldValues: entity.oldValues,
      newValues: entity.newValues,
      changes: entity.changes,
      ipAddress: entity.ipAddress,
      userAgent: entity.userAgent,
      requestId: entity.requestId,
      method: entity.method,
      url: entity.url,
      statusCode: entity.statusCode,
      responseTime: entity.responseTime,
      level: entity.level as AuditLevel,
      message: entity.message,
      metadata: entity.metadata,
      tags: entity.tags
        ? entity.tags.split(',').map((tag) => tag.trim())
        : undefined,
      createdAt: entity.createdAt,
    });
  }
}
