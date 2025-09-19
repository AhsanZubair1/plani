import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLogEntity } from '../infrastructure/persistence/relational/entities/audit-log.entity';
import { AuditAction } from '../domain/audit-log';

@Injectable()
export class AuditStatisticsService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async getEntityRequestStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalRequests: number;
    entityStats: Array<{
      entity: string;
      totalRequests: number;
      getRequests: number;
      postRequests: number;
      putRequests: number;
      deleteRequests: number;
      averageResponseTime: number;
      errorCount: number;
      successRate: number;
    }>;
    hourlyStats: Array<{
      hour: string;
      requests: number;
    }>;
    topEndpoints: Array<{
      endpoint: string;
      requests: number;
      averageResponseTime: number;
    }>;
  }> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.tags LIKE :databaseTag', { databaseTag: '%database%' });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'audit.created_at BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    const logs = await queryBuilder.getMany();

    // Group by entity
    const entityMap = new Map<string, any>();
    const hourlyMap = new Map<string, number>();
    const endpointMap = new Map<
      string,
      { requests: number; totalTime: number }
    >();

    logs.forEach((log) => {
      const entity = log.resource;
      const hour = new Date(log.createdAt).toISOString().substring(0, 13);
      const endpoint =
        typeof log.changes?.endpoint === 'string'
          ? log.changes.endpoint
          : 'unknown';
      const responseTime =
        typeof log.changes?.duration === 'number' ? log.changes.duration : 0;
      const isError = log.level === 'ERROR';

      // Entity stats
      if (!entityMap.has(entity)) {
        entityMap.set(entity, {
          entity,
          totalRequests: 0,
          getRequests: 0,
          postRequests: 0,
          putRequests: 0,
          deleteRequests: 0,
          totalResponseTime: 0,
          errorCount: 0,
        });
      }

      const entityStat = entityMap.get(entity);
      entityStat.totalRequests++;
      entityStat.totalResponseTime += responseTime;
      if (isError) entityStat.errorCount++;

      // Count by HTTP method
      switch (log.action) {
        case AuditAction.READ:
          entityStat.getRequests++;
          break;
        case AuditAction.CREATE:
          entityStat.postRequests++;
          break;
        case AuditAction.UPDATE:
          entityStat.putRequests++;
          break;
        case AuditAction.DELETE:
          entityStat.deleteRequests++;
          break;
      }

      // Hourly stats
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);

      // Endpoint stats
      if (!endpointMap.has(endpoint)) {
        endpointMap.set(endpoint, { requests: 0, totalTime: 0 });
      }
      const endpointStat = endpointMap.get(endpoint);
      if (endpointStat) {
        endpointStat.requests++;
        endpointStat.totalTime += responseTime;
      }
    });

    // Process entity stats
    const entityStats = Array.from(entityMap.values()).map((stat) => ({
      entity: stat.entity,
      totalRequests: stat.totalRequests,
      getRequests: stat.getRequests,
      postRequests: stat.postRequests,
      putRequests: stat.putRequests,
      deleteRequests: stat.deleteRequests,
      averageResponseTime: Math.round(
        stat.totalResponseTime / stat.totalRequests,
      ),
      errorCount: stat.errorCount,
      successRate: Math.round(
        ((stat.totalRequests - stat.errorCount) / stat.totalRequests) * 100,
      ),
    }));

    // Process hourly stats
    const hourlyStats = Array.from(hourlyMap.entries())
      .map(([hour, requests]) => ({ hour, requests }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // Process top endpoints
    const topEndpoints = Array.from(endpointMap.entries())
      .map(([endpoint, stat]) => ({
        endpoint,
        requests: stat.requests,
        averageResponseTime: Math.round(stat.totalTime / stat.requests),
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);

    return {
      totalRequests: logs.length,
      entityStats,
      hourlyStats,
      topEndpoints,
    };
  }

  async getEntityRequestCount(
    entity: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.resource = :entity', { entity })
      .andWhere('audit.tags LIKE :databaseTag', { databaseTag: '%database%' });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'audit.created_at BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    return await queryBuilder.getCount();
  }

  async getRecentActivity(limit: number = 50): Promise<
    Array<{
      id: number;
      action: string;
      resource: string;
      endpoint: string;
      statusCode: number;
      duration: number;
      user: string;
      timestamp: Date;
    }>
  > {
    const logs = await this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.tags LIKE :databaseTag', { databaseTag: '%database%' })
      .orderBy('audit.created_at', 'DESC')
      .limit(limit)
      .getMany();

    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      resource: log.resource,
      endpoint:
        typeof log.changes?.endpoint === 'string'
          ? log.changes.endpoint
          : 'unknown',
      statusCode:
        typeof log.changes?.statusCode === 'number'
          ? log.changes.statusCode
          : 0,
      duration:
        typeof log.changes?.duration === 'number' ? log.changes.duration : 0,
      user: log.userName || log.userId || 'anonymous',
      timestamp: log.createdAt,
    }));
  }

  async getErrorStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalErrors: number;
    errorRate: number;
    errorsByEntity: Array<{
      entity: string;
      errorCount: number;
      errorRate: number;
    }>;
    errorsByEndpoint: Array<{
      endpoint: string;
      errorCount: number;
      errorRate: number;
    }>;
  }> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.tags LIKE :databaseTag', { databaseTag: '%database%' });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'audit.created_at BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    }

    const allLogs = await queryBuilder.getMany();
    const errorLogs = allLogs.filter((log) => log.level === 'ERROR');

    // Group errors by entity
    const entityErrorMap = new Map<string, number>();
    const endpointErrorMap = new Map<string, number>();

    errorLogs.forEach((log) => {
      const entity = log.resource;
      const endpoint =
        typeof log.changes?.endpoint === 'string'
          ? log.changes.endpoint
          : 'unknown';

      entityErrorMap.set(entity, (entityErrorMap.get(entity) || 0) + 1);
      endpointErrorMap.set(endpoint, (endpointErrorMap.get(endpoint) || 0) + 1);
    });

    const errorsByEntity = Array.from(entityErrorMap.entries()).map(
      ([entity, errorCount]) => {
        const totalRequests = allLogs.filter(
          (log) => log.resource === entity,
        ).length;
        return {
          entity,
          errorCount,
          errorRate:
            totalRequests > 0
              ? Math.round((errorCount / totalRequests) * 100)
              : 0,
        };
      },
    );

    const errorsByEndpoint = Array.from(endpointErrorMap.entries()).map(
      ([endpoint, errorCount]) => {
        const totalRequests = allLogs.filter((log) => {
          const logEndpoint =
            typeof log.changes?.endpoint === 'string'
              ? log.changes.endpoint
              : 'unknown';
          return logEndpoint === endpoint;
        }).length;
        return {
          endpoint,
          errorCount,
          errorRate:
            totalRequests > 0
              ? Math.round((errorCount / totalRequests) * 100)
              : 0,
        };
      },
    );

    return {
      totalErrors: errorLogs.length,
      errorRate:
        allLogs.length > 0
          ? Math.round((errorLogs.length / allLogs.length) * 100)
          : 0,
      errorsByEntity: errorsByEntity.sort(
        (a, b) => b.errorCount - a.errorCount,
      ),
      errorsByEndpoint: errorsByEndpoint.sort(
        (a, b) => b.errorCount - a.errorCount,
      ),
    };
  }
}
