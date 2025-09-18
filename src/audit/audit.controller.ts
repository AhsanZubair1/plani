import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuditService } from './audit.service';
import { AuditQueryDto } from './dto/audit-query.dto';
import {
  AuditLogListResponseDto,
  AuditStatsResponseDto,
} from './dto/audit-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Audit')
@Controller('audit')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
    type: AuditLogListResponseDto,
  })
  async getAuditLogs(
    @Query() query: AuditQueryDto,
  ): Promise<AuditLogListResponseDto> {
    const { logs, total } = await this.auditService.searchAuditLogs({
      userId: query.userId,
      resource: query.resource,
      action: query.action,
      level: query.level,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      tags: query.tags,
      limit: query.limit,
      offset: query.offset,
    });

    const page = Math.floor((query.offset || 0) / (query.limit || 100)) + 1;
    const totalPages = Math.ceil(total / (query.limit || 100));

    return {
      data: logs.map((log) => log.toJSON()),
      total,
      page,
      limit: query.limit || 100,
      totalPages,
    };
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiResponse({
    status: 200,
    description: 'Audit log retrieved successfully',
  })
  async getAuditLogById(@Param('id') id: string) {
    const log = await this.auditService.getAuditLogById(parseInt(id, 10));
    return log ? log.toJSON() : null;
  }

  @Get('trail/:resource/:resourceId')
  @ApiOperation({ summary: 'Get audit trail for a specific resource' })
  @ApiResponse({
    status: 200,
    description: 'Audit trail retrieved successfully',
    type: AuditLogListResponseDto,
  })
  async getAuditTrail(
    @Param('resource') resource: string,
    @Param('resourceId') resourceId: string,
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
  ): Promise<AuditLogListResponseDto> {
    const logs = await this.auditService.getAuditTrail(
      resource,
      resourceId,
      limit,
      offset,
    );
    const total = logs.length; // This is a simplified approach

    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data: logs.map((log) => log.toJSON()),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Get('user/:userId/activity')
  @ApiOperation({ summary: 'Get user activity logs' })
  @ApiResponse({
    status: 200,
    description: 'User activity logs retrieved successfully',
    type: AuditLogListResponseDto,
  })
  async getUserActivity(
    @Param('userId') userId: string,
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
  ): Promise<AuditLogListResponseDto> {
    const logs = await this.auditService.getUserActivity(userId, limit, offset);
    const total = logs.length; // This is a simplified approach

    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data: logs.map((log) => log.toJSON()),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get audit statistics' })
  @ApiResponse({
    status: 200,
    description: 'Audit statistics retrieved successfully',
    type: AuditStatsResponseDto,
  })
  async getAuditStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<AuditStatsResponseDto> {
    return this.auditService.getAuditStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Post('export')
  @ApiOperation({ summary: 'Export audit logs' })
  @ApiResponse({
    status: 200,
    description: 'Audit logs exported successfully',
  })
  async exportAuditLogs(
    @Query() query: AuditQueryDto & { format?: 'json' | 'csv' },
    @Res() res: Response,
  ) {
    const buffer = await this.auditService.exportAuditLogs({
      userId: query.userId,
      resource: query.resource,
      action: query.action,
      level: query.level,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      format: query.format || 'csv',
    });

    const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.${query.format || 'csv'}`;
    const contentType =
      query.format === 'json' ? 'application/json' : 'text/csv';

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });

    res.send(buffer);
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Clean up old audit logs' })
  @ApiResponse({
    status: 200,
    description: 'Old audit logs cleaned up successfully',
  })
  async cleanupOldLogs(@Query('retentionDays') retentionDays: string = '90') {
    const deletedCount = await this.auditService.cleanupOldLogs(
      parseInt(retentionDays, 10),
    );
    return {
      message: `Successfully cleaned up ${deletedCount} audit logs older than ${retentionDays} days`,
      deletedCount,
    };
  }
}
