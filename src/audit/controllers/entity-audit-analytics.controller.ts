import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  ParseDatePipe,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { EntityAuditAnalyticsService } from '../services/entity-audit-analytics.service';
import {
  EntityAuditStats,
  EntityPercentageStats,
  EntityComparisonStats,
  TimeBasedAuditStats,
} from '../services/entity-audit-analytics.service';

@ApiTags('Entity Audit Analytics')
@Controller({
  path: 'audit/analytics/entities',
  version: '1',
})
export class EntityAuditAnalyticsController {
  constructor(
    private readonly entityAuditAnalyticsService: EntityAuditAnalyticsService,
  ) {}

  @Get('stats/:entity')
  @ApiOperation({ summary: 'Get audit statistics for a specific entity' })
  @ApiParam({
    name: 'entity',
    description: 'Entity name (e.g., plans, users, campaigns)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Entity audit statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        entity: { type: 'string' },
        totalOperations: { type: 'number' },
        createOperations: { type: 'number' },
        readOperations: { type: 'number' },
        updateOperations: { type: 'number' },
        deleteOperations: { type: 'number' },
        uniqueRecords: { type: 'number' },
        averageOperationsPerRecord: { type: 'number' },
        lastActivity: { type: 'string', format: 'date-time' },
        activityTrend: {
          type: 'string',
          enum: ['increasing', 'decreasing', 'stable'],
        },
      },
    },
  })
  async getEntityAuditStats(
    @Param('entity') entity: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<EntityAuditStats> {
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      if (start && end && start > end) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.entityAuditAnalyticsService.getEntityAuditStats(
        entity,
        start,
        end,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve entity audit statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('percentages/:entity')
  @ApiOperation({ summary: 'Get percentage-based statistics for an entity' })
  @ApiParam({
    name: 'entity',
    description: 'Entity name (e.g., plans, users, campaigns)',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Entity percentage statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        entity: { type: 'string' },
        totalAuditEntries: { type: 'number' },
        percentageOfTotalAudits: { type: 'number' },
        percentageOfCreateOperations: { type: 'number' },
        percentageOfReadOperations: { type: 'number' },
        percentageOfUpdateOperations: { type: 'number' },
        percentageOfDeleteOperations: { type: 'number' },
        mostActiveEntity: { type: 'boolean' },
        leastActiveEntity: { type: 'boolean' },
      },
    },
  })
  async getEntityPercentageStats(
    @Param('entity') entity: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<EntityPercentageStats> {
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      if (start && end && start > end) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.entityAuditAnalyticsService.getEntityPercentageStats(
        entity,
        start,
        end,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve entity percentage statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('compare/:entity1/:entity2')
  @ApiOperation({ summary: 'Compare audit statistics between two entities' })
  @ApiParam({ name: 'entity1', description: 'First entity name' })
  @ApiParam({ name: 'entity2', description: 'Second entity name' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Entity comparison statistics retrieved successfully',
  })
  async getEntityComparisonStats(
    @Param('entity1') entity1: string,
    @Param('entity2') entity2: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<EntityComparisonStats> {
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      if (start && end && start > end) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.entityAuditAnalyticsService.getEntityComparisonStats(
        entity1,
        entity2,
        start,
        end,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve entity comparison statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('time-based/:entity')
  @ApiOperation({ summary: 'Get time-based audit statistics for an entity' })
  @ApiParam({ name: 'entity', description: 'Entity name' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'Time-based audit statistics retrieved successfully',
  })
  async getTimeBasedAuditStats(
    @Param('entity') entity: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<TimeBasedAuditStats> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.entityAuditAnalyticsService.getTimeBasedAuditStats(
        entity,
        start,
        end,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve time-based audit statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all/stats')
  @ApiOperation({ summary: 'Get audit statistics for all entities' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'All entities audit statistics retrieved successfully',
    type: 'array',
  })
  async getAllEntitiesAuditStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<EntityAuditStats[]> {
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      if (start && end && start > end) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.entityAuditAnalyticsService.getAllEntitiesAuditStats(
        start,
        end,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve all entities audit statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all/percentages')
  @ApiOperation({ summary: 'Get percentage statistics for all entities' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO string)',
  })
  @ApiResponse({
    status: 200,
    description: 'All entities percentage statistics retrieved successfully',
    type: 'array',
  })
  async getAllEntitiesPercentageStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<EntityPercentageStats[]> {
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      if (start && end && start > end) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.entityAuditAnalyticsService.getAllEntitiesPercentageStats(
        start,
        end,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve all entities percentage statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
