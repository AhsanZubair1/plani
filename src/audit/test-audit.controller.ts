import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuditService } from './audit.service';
import { AuditAction, AuditLevel } from './domain/audit-log';

@ApiTags('Audit Test')
@Controller('audit-test')
export class TestAuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('test')
  @ApiOperation({ summary: 'Test audit logging' })
  @ApiResponse({ status: 200, description: 'Test completed' })
  async testAudit() {
    // Test basic audit logging
    await this.auditService.log(
      AuditAction.READ,
      'test_resource',
      'Test audit log entry',
      {
        userId: 'test_user',
        userName: 'Test User',
        userEmail: 'test@example.com',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        metadata: {
          source: 'test_endpoint',
          testType: 'basic_logging',
        },
        tags: ['test', 'audit'],
      },
      {
        level: AuditLevel.INFO,
      },
    );

    return { message: 'Audit test completed successfully' };
  }

  @Post('test-create')
  @ApiOperation({ summary: 'Test audit logging for create operation' })
  @ApiResponse({ status: 200, description: 'Test completed' })
  async testCreateAudit() {
    // Test create audit logging
    await this.auditService.logCreate(
      'test_plans',
      { name: 'Test Plan', price: 100 },
      {
        userId: 'test_user',
        userName: 'Test User',
        userEmail: 'test@example.com',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent',
        metadata: {
          source: 'test_endpoint',
          testType: 'create_operation',
        },
        tags: ['test', 'create'],
      },
      'test_plan_123',
    );

    return { message: 'Create audit test completed successfully' };
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get recent audit logs (no auth required)' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved' })
  async getAuditLogs() {
    // Get recent audit logs without authentication
    const { logs, total } = await this.auditService.searchAuditLogs({
      limit: 10,
      offset: 0,
    });

    return {
      message: 'Audit logs retrieved successfully',
      logs: logs,
      total: total,
    };
  }
}
