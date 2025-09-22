import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLogEntity } from '@src/audit/infrastructure/persistence/relational/entities/audit-log.entity';
import { AuditStatisticsService } from '@src/audit/services/audit-statistics.service';

@ApiTags('Audit Analytics')
@Controller({
  path: 'audit/analytics',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class AuditAnalyticsController {
  constructor(
    private readonly auditStatisticsService: AuditStatisticsService,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  @Get('entity-stats')
  @ApiOperation({ summary: 'Get entity request statistics' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Entity statistics retrieved successfully',
  })
  async getEntityStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return await this.auditStatisticsService.getEntityRequestStats(start, end);
  }

  @Get('entity/:entity/count')
  @ApiOperation({ summary: 'Get request count for specific entity' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Entity request count retrieved successfully',
  })
  async getEntityCount(
    @Param('entity') entity: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const count = await this.auditStatisticsService.getEntityRequestCount(
      entity,
      start,
      end,
    );
    return {
      entity,
      requestCount: count,
      period: {
        startDate: start,
        endDate: end,
      },
    };
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent database activity' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Recent activity retrieved successfully',
  })
  async getRecentActivity(@Query('limit', ParseIntPipe) limit: number = 50) {
    return await this.auditStatisticsService.getRecentActivity(limit);
  }

  @Get('error-stats')
  @ApiOperation({ summary: 'Get error statistics' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Error statistics retrieved successfully',
  })
  async getErrorStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return await this.auditStatisticsService.getErrorStats(start, end);
  }

  @Get('database-operations')
  @ApiOperation({ summary: 'Get detailed database operations log' })
  @ApiQuery({ name: 'entity', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Database operations retrieved successfully',
  })
  async getDatabaseOperations(
    @Query('entity') entity?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.tags LIKE :databaseTag', { databaseTag: '%database%' })
      .orderBy('audit.created_at', 'DESC')
      .skip((pageNum - 1) * limitNum)
      .take(limitNum);

    if (entity) {
      queryBuilder.andWhere('audit.resource = :entity', { entity });
    }

    if (action) {
      queryBuilder.andWhere('audit.action = :action', { action });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'audit.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      );
    }

    const [logs, total] = await queryBuilder.getManyAndCount();

    return {
      data: logs.map((log) => ({
        id: log.id,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId,
        endpoint: log.changes?.endpoint || 'unknown',
        method: log.changes?.method || 'unknown',
        url: log.changes?.url || 'unknown',
        statusCode: log.changes?.statusCode || 0,
        duration: log.changes?.duration || 0,
        userAgent: log.changes?.userAgent || 'unknown',
        ip: log.changes?.ip || 'unknown',
        userId: log.userId,
        userName: log.userName,
        query: log.changes?.query || null,
        requestBody: log.newValues,
        response: log.changes?.response || null,
        isError: log.level === 'ERROR',
        message: log.message,
        tags: log.tags,
        createdAt: log.createdAt,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Get('performance-metrics')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Performance metrics retrieved successfully',
  })
  async getPerformanceMetrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.tags LIKE :databaseTag', { databaseTag: '%database%' });

    if (start && end) {
      queryBuilder.andWhere(
        'audit.created_at BETWEEN :startDate AND :endDate',
        {
          startDate: start,
          endDate: end,
        },
      );
    }

    const logs = await queryBuilder.getMany();

    const durations = logs
      .map((log) => {
        const duration = log.changes?.duration;
        return typeof duration === 'number' ? duration : 0;
      })
      .filter((duration) => duration > 0);

    const sortedDurations = durations.sort((a, b) => a - b);
    const count = sortedDurations.length;

    if (count === 0) {
      return {
        averageResponseTime: 0,
        medianResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        totalRequests: 0,
      };
    }

    const average =
      durations.reduce((sum, duration) => sum + duration, 0) / count;
    const median =
      count % 2 === 0
        ? (sortedDurations[count / 2 - 1] + sortedDurations[count / 2]) / 2
        : sortedDurations[Math.floor(count / 2)];
    const p95Index = Math.floor(count * 0.95);
    const p99Index = Math.floor(count * 0.99);

    return {
      averageResponseTime: Math.round(average),
      medianResponseTime: Math.round(median),
      p95ResponseTime: Math.round(sortedDurations[p95Index] || 0),
      p99ResponseTime: Math.round(sortedDurations[p99Index] || 0),
      minResponseTime: Math.round(sortedDurations[0] || 0),
      maxResponseTime: Math.round(sortedDurations[count - 1] || 0),
      totalRequests: count,
    };
  }
}
