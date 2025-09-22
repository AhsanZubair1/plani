import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditAction } from '@src/audit/domain/audit-log';
import { AuditLogEntity } from '@src/audit/infrastructure/persistence/relational/entities/audit-log.entity';

export interface EntityAuditStats {
  entity: string;
  totalOperations: number;
  createOperations: number;
  readOperations: number;
  updateOperations: number;
  deleteOperations: number;
  uniqueRecords: number;
  averageOperationsPerRecord: number;
  lastActivity: Date | null;
  activityTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface EntityPercentageStats {
  entity: string;
  totalAuditEntries: number;
  percentageOfTotalAudits: number;
  percentageOfCreateOperations: number;
  percentageOfReadOperations: number;
  percentageOfUpdateOperations: number;
  percentageOfDeleteOperations: number;
  mostActiveEntity: boolean;
  leastActiveEntity: boolean;
}

export interface EntityComparisonStats {
  entity1: string;
  entity2: string;
  entity1TotalOperations: number;
  entity2TotalOperations: number;
  entity1Percentage: number;
  entity2Percentage: number;
  operationComparison: Array<{
    operation: string;
    entity1Count: number;
    entity2Count: number;
    entity1Percentage: number;
    entity2Percentage: number;
  }>;
}

export interface TimeBasedAuditStats {
  entity: string;
  timeRange: {
    startDate: Date;
    endDate: Date;
  };
  hourlyStats: Array<{
    hour: string;
    operations: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    day: string;
    operations: number;
    percentage: number;
  }>;
  weeklyStats: Array<{
    week: string;
    operations: number;
    percentage: number;
  }>;
  monthlyStats: Array<{
    month: string;
    operations: number;
    percentage: number;
  }>;
}

@Injectable()
export class EntityAuditAnalyticsService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  /**
   * Get comprehensive audit statistics for a specific entity
   */
  async getEntityAuditStats(
    entity: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<EntityAuditStats> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.resource = :entity', { entity })
      .andWhere('audit.tags LIKE :databaseTag', { databaseTag: '%database%' });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'audit.created_at BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    const logs = await queryBuilder.getMany();

    // Calculate operation counts
    const createOperations = logs.filter(
      (log) => log.action === AuditAction.CREATE,
    ).length;
    const readOperations = logs.filter(
      (log) => log.action === AuditAction.READ,
    ).length;
    const updateOperations = logs.filter(
      (log) => log.action === AuditAction.UPDATE,
    ).length;
    const deleteOperations = logs.filter(
      (log) => log.action === AuditAction.DELETE,
    ).length;

    // Get unique records (based on resourceId)
    const uniqueRecords = new Set(
      logs
        .map((log) => log.resourceId)
        .filter((id) => id !== null && id !== undefined),
    ).size;

    // Calculate average operations per record
    const averageOperationsPerRecord =
      uniqueRecords > 0
        ? Math.round((logs.length / uniqueRecords) * 100) / 100
        : 0;

    // Get last activity
    const lastActivity =
      logs.length > 0
        ? new Date(Math.max(...logs.map((log) => log.createdAt.getTime())))
        : null;

    // Calculate activity trend (compare first half vs second half of time range)
    let activityTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (logs.length > 10 && startDate && endDate) {
      const midpoint = new Date(
        startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2,
      );
      const firstHalf = logs.filter((log) => log.createdAt < midpoint).length;
      const secondHalf = logs.filter((log) => log.createdAt >= midpoint).length;

      const percentageChange =
        firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

      if (percentageChange > 10) activityTrend = 'increasing';
      else if (percentageChange < -10) activityTrend = 'decreasing';
      else activityTrend = 'stable';
    }

    return {
      entity,
      totalOperations: logs.length,
      createOperations,
      readOperations,
      updateOperations,
      deleteOperations,
      uniqueRecords,
      averageOperationsPerRecord,
      lastActivity,
      activityTrend,
    };
  }

  /**
   * Get percentage-based statistics for an entity compared to all entities
   */
  async getEntityPercentageStats(
    entity: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<EntityPercentageStats> {
    // Get stats for the specific entity
    const entityStats = await this.getEntityAuditStats(
      entity,
      startDate,
      endDate,
    );

    // Get total stats for all entities
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.tags LIKE :databaseTag', { databaseTag: '%database%' });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'audit.created_at BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    const allLogs = await queryBuilder.getMany();

    // Calculate total operation counts
    const totalCreateOperations = allLogs.filter(
      (log) => log.action === AuditAction.CREATE,
    ).length;
    const totalReadOperations = allLogs.filter(
      (log) => log.action === AuditAction.READ,
    ).length;
    const totalUpdateOperations = allLogs.filter(
      (log) => log.action === AuditAction.UPDATE,
    ).length;
    const totalDeleteOperations = allLogs.filter(
      (log) => log.action === AuditAction.DELETE,
    ).length;

    // Calculate percentages
    const percentageOfTotalAudits =
      allLogs.length > 0
        ? Math.round(
            (entityStats.totalOperations / allLogs.length) * 100 * 100,
          ) / 100
        : 0;

    const percentageOfCreateOperations =
      totalCreateOperations > 0
        ? Math.round(
            (entityStats.createOperations / totalCreateOperations) * 100 * 100,
          ) / 100
        : 0;

    const percentageOfReadOperations =
      totalReadOperations > 0
        ? Math.round(
            (entityStats.readOperations / totalReadOperations) * 100 * 100,
          ) / 100
        : 0;

    const percentageOfUpdateOperations =
      totalUpdateOperations > 0
        ? Math.round(
            (entityStats.updateOperations / totalUpdateOperations) * 100 * 100,
          ) / 100
        : 0;

    const percentageOfDeleteOperations =
      totalDeleteOperations > 0
        ? Math.round(
            (entityStats.deleteOperations / totalDeleteOperations) * 100 * 100,
          ) / 100
        : 0;

    // Determine if this is the most/least active entity
    const entityOperationCounts = new Map<string, number>();
    allLogs.forEach((log) => {
      entityOperationCounts.set(
        log.resource,
        (entityOperationCounts.get(log.resource) || 0) + 1,
      );
    });

    const sortedEntities = Array.from(entityOperationCounts.entries()).sort(
      ([, a], [, b]) => b - a,
    );

    const mostActiveEntity =
      sortedEntities.length > 0 && sortedEntities[0][0] === entity;
    const leastActiveEntity =
      sortedEntities.length > 0 &&
      sortedEntities[sortedEntities.length - 1][0] === entity;

    return {
      entity,
      totalAuditEntries: entityStats.totalOperations,
      percentageOfTotalAudits,
      percentageOfCreateOperations,
      percentageOfReadOperations,
      percentageOfUpdateOperations,
      percentageOfDeleteOperations,
      mostActiveEntity,
      leastActiveEntity,
    };
  }

  /**
   * Compare audit statistics between two entities
   */
  async getEntityComparisonStats(
    entity1: string,
    entity2: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<EntityComparisonStats> {
    const [stats1, stats2] = await Promise.all([
      this.getEntityAuditStats(entity1, startDate, endDate),
      this.getEntityAuditStats(entity2, startDate, endDate),
    ]);

    const totalOperations = stats1.totalOperations + stats2.totalOperations;

    const entity1Percentage =
      totalOperations > 0
        ? Math.round((stats1.totalOperations / totalOperations) * 100 * 100) /
          100
        : 0;

    const entity2Percentage =
      totalOperations > 0
        ? Math.round((stats2.totalOperations / totalOperations) * 100 * 100) /
          100
        : 0;

    const operationComparison = [
      {
        operation: 'CREATE',
        entity1Count: stats1.createOperations,
        entity2Count: stats2.createOperations,
        entity1Percentage:
          stats1.createOperations + stats2.createOperations > 0
            ? Math.round(
                (stats1.createOperations /
                  (stats1.createOperations + stats2.createOperations)) *
                  100 *
                  100,
              ) / 100
            : 0,
        entity2Percentage:
          stats1.createOperations + stats2.createOperations > 0
            ? Math.round(
                (stats2.createOperations /
                  (stats1.createOperations + stats2.createOperations)) *
                  100 *
                  100,
              ) / 100
            : 0,
      },
      {
        operation: 'READ',
        entity1Count: stats1.readOperations,
        entity2Count: stats2.readOperations,
        entity1Percentage:
          stats1.readOperations + stats2.readOperations > 0
            ? Math.round(
                (stats1.readOperations /
                  (stats1.readOperations + stats2.readOperations)) *
                  100 *
                  100,
              ) / 100
            : 0,
        entity2Percentage:
          stats1.readOperations + stats2.readOperations > 0
            ? Math.round(
                (stats2.readOperations /
                  (stats1.readOperations + stats2.readOperations)) *
                  100 *
                  100,
              ) / 100
            : 0,
      },
      {
        operation: 'UPDATE',
        entity1Count: stats1.updateOperations,
        entity2Count: stats2.updateOperations,
        entity1Percentage:
          stats1.updateOperations + stats2.updateOperations > 0
            ? Math.round(
                (stats1.updateOperations /
                  (stats1.updateOperations + stats2.updateOperations)) *
                  100 *
                  100,
              ) / 100
            : 0,
        entity2Percentage:
          stats1.updateOperations + stats2.updateOperations > 0
            ? Math.round(
                (stats2.updateOperations /
                  (stats1.updateOperations + stats2.updateOperations)) *
                  100 *
                  100,
              ) / 100
            : 0,
      },
      {
        operation: 'DELETE',
        entity1Count: stats1.deleteOperations,
        entity2Count: stats2.deleteOperations,
        entity1Percentage:
          stats1.deleteOperations + stats2.deleteOperations > 0
            ? Math.round(
                (stats1.deleteOperations /
                  (stats1.deleteOperations + stats2.deleteOperations)) *
                  100 *
                  100,
              ) / 100
            : 0,
        entity2Percentage:
          stats1.deleteOperations + stats2.deleteOperations > 0
            ? Math.round(
                (stats2.deleteOperations /
                  (stats1.deleteOperations + stats2.deleteOperations)) *
                  100 *
                  100,
              ) / 100
            : 0,
      },
    ];

    return {
      entity1,
      entity2,
      entity1TotalOperations: stats1.totalOperations,
      entity2TotalOperations: stats2.totalOperations,
      entity1Percentage,
      entity2Percentage,
      operationComparison,
    };
  }

  /**
   * Get time-based audit statistics for an entity
   */
  async getTimeBasedAuditStats(
    entity: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TimeBasedAuditStats> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.resource = :entity', { entity })
      .andWhere('audit.tags LIKE :databaseTag', { databaseTag: '%database%' })
      .andWhere('audit.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('audit.created_at', 'ASC');

    const logs = await queryBuilder.getMany();

    // Group by different time periods
    const hourlyMap = new Map<string, number>();
    const dailyMap = new Map<string, number>();
    const weeklyMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();

    logs.forEach((log) => {
      const date = new Date(log.createdAt);

      // Hourly grouping
      const hourKey = date.toISOString().substring(0, 13);
      hourlyMap.set(hourKey, (hourlyMap.get(hourKey) || 0) + 1);

      // Daily grouping
      const dayKey = date.toISOString().substring(0, 10);
      dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + 1);

      // Weekly grouping (ISO week)
      const weekKey = this.getWeekKey(date);
      weeklyMap.set(weekKey, (weeklyMap.get(weekKey) || 0) + 1);

      // Monthly grouping
      const monthKey = date.toISOString().substring(0, 7);
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
    });

    const totalOperations = logs.length;

    // Convert maps to arrays with percentages
    const hourlyStats = Array.from(hourlyMap.entries())
      .map(([hour, operations]) => ({
        hour,
        operations,
        percentage:
          totalOperations > 0
            ? Math.round((operations / totalOperations) * 100 * 100) / 100
            : 0,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    const dailyStats = Array.from(dailyMap.entries())
      .map(([day, operations]) => ({
        day,
        operations,
        percentage:
          totalOperations > 0
            ? Math.round((operations / totalOperations) * 100 * 100) / 100
            : 0,
      }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const weeklyStats = Array.from(weeklyMap.entries())
      .map(([week, operations]) => ({
        week,
        operations,
        percentage:
          totalOperations > 0
            ? Math.round((operations / totalOperations) * 100 * 100) / 100
            : 0,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));

    const monthlyStats = Array.from(monthlyMap.entries())
      .map(([month, operations]) => ({
        month,
        operations,
        percentage:
          totalOperations > 0
            ? Math.round((operations / totalOperations) * 100 * 100) / 100
            : 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      entity,
      timeRange: { startDate, endDate },
      hourlyStats,
      dailyStats,
      weeklyStats,
      monthlyStats,
    };
  }

  /**
   * Get audit statistics for all entities
   */
  async getAllEntitiesAuditStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<EntityAuditStats[]> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.tags LIKE :databaseTag', { databaseTag: '%database%' })
      .select('audit.resource')
      .groupBy('audit.resource');

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'audit.created_at BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    const entities = await queryBuilder.getRawMany();
    const entityNames = entities.map((entity) => entity.audit_resource);

    const statsPromises = entityNames.map((entity) =>
      this.getEntityAuditStats(entity, startDate, endDate),
    );

    const allStats = await Promise.all(statsPromises);

    return allStats.sort((a, b) => b.totalOperations - a.totalOperations);
  }

  /**
   * Get percentage statistics for all entities
   */
  async getAllEntitiesPercentageStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<EntityPercentageStats[]> {
    const allStats = await this.getAllEntitiesAuditStats(startDate, endDate);

    const percentageStatsPromises = allStats.map((stat) =>
      this.getEntityPercentageStats(stat.entity, startDate, endDate),
    );

    const allPercentageStats = await Promise.all(percentageStatsPromises);

    return allPercentageStats.sort(
      (a, b) => b.percentageOfTotalAudits - a.percentageOfTotalAudits,
    );
  }

  /**
   * Helper method to get ISO week key
   */
  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = this.getISOWeek(date);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  /**
   * Helper method to get ISO week number
   */
  private getISOWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }
}
