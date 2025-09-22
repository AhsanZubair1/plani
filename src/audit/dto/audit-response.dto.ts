import { ApiProperty } from '@nestjs/swagger';
import { AuditAction, AuditLevel } from '../domain/audit-log';

export class AuditLogResponseDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Audit log ID',
  })
  id?: number;

  @ApiProperty({
    type: String,
    example: 'user123',
    description: 'User ID who performed the action',
  })
  userId?: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'User name who performed the action',
  })
  userName?: string;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
    description: 'User email who performed the action',
  })
  userEmail?: string;

  @ApiProperty({
    type: String,
    example: 'session123',
    description: 'Session ID',
  })
  sessionId?: string;

  @ApiProperty({
    type: String,
    example: AuditAction.CREATE,
    enum: AuditAction,
    description: 'Action performed',
  })
  action: AuditAction;

  @ApiProperty({
    type: String,
    example: 'plans',
    description: 'Resource that was affected',
  })
  resource: string;

  @ApiProperty({
    type: String,
    example: '123',
    description: 'ID of the affected resource',
  })
  resourceId?: string | number;

  @ApiProperty({
    type: Object,
    example: { name: 'Old Plan Name' },
    description: 'Old values before the change',
  })
  oldValues?: Record<string, any>;

  @ApiProperty({
    type: Object,
    example: { name: 'New Plan Name' },
    description: 'New values after the change',
  })
  newValues?: Record<string, any>;

  @ApiProperty({
    type: Object,
    example: { name: { old: 'Old Plan Name', new: 'New Plan Name' } },
    description: 'Detailed changes made',
  })
  changes?: Record<string, { old: any; new: any }>;

  @ApiProperty({
    type: String,
    example: '192.168.1.1',
    description: 'IP address of the user',
  })
  ipAddress?: string;

  @ApiProperty({
    type: String,
    example: 'Mozilla/5.0...',
    description: 'User agent string',
  })
  userAgent?: string;

  @ApiProperty({
    type: String,
    example: 'req-123',
    description: 'Request ID',
  })
  requestId?: string;

  @ApiProperty({
    type: String,
    example: 'POST',
    description: 'HTTP method',
  })
  method?: string;

  @ApiProperty({
    type: String,
    example: '/api/plans',
    description: 'Request URL',
  })
  url?: string;

  @ApiProperty({
    type: Number,
    example: 200,
    description: 'HTTP status code',
  })
  statusCode?: number;

  @ApiProperty({
    type: Number,
    example: 150,
    description: 'Response time in milliseconds',
  })
  responseTime?: number;

  @ApiProperty({
    type: String,
    example: AuditLevel.INFO,
    enum: AuditLevel,
    description: 'Log level',
  })
  level: AuditLevel;

  @ApiProperty({
    type: String,
    example: 'Created plan',
    description: 'Audit message',
  })
  message: string;

  @ApiProperty({
    type: Object,
    example: { controller: 'PlansController', method: 'create' },
    description: 'Additional metadata',
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    type: [String],
    example: ['database', 'create'],
    description: 'Tags associated with the audit log',
  })
  tags?: string[];

  @ApiProperty({
    type: String,
    example: '2024-01-01T00:00:00Z',
    description: 'When the audit log was created',
  })
  createdAt?: Date;
}

export class AuditLogListResponseDto {
  @ApiProperty({
    type: [AuditLogResponseDto],
    description: 'List of audit logs',
  })
  data: AuditLogResponseDto[];

  @ApiProperty({
    type: Number,
    example: 1000,
    description: 'Total number of audit logs matching the query',
  })
  total: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    type: Number,
    example: 100,
    description: 'Number of records per page',
  })
  limit: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Total number of pages',
  })
  totalPages: number;
}

export class AuditStatsResponseDto {
  @ApiProperty({
    type: Number,
    example: 1000,
    description: 'Total number of audit logs',
  })
  totalLogs: number;

  @ApiProperty({
    type: Object,
    example: { CREATE: 100, UPDATE: 200, DELETE: 50 },
    description: 'Number of logs by action',
  })
  logsByAction: Record<string, number>;

  @ApiProperty({
    type: Object,
    example: { INFO: 800, WARNING: 150, ERROR: 50 },
    description: 'Number of logs by level',
  })
  logsByLevel: Record<string, number>;

  @ApiProperty({
    type: Object,
    example: { plans: 300, users: 200, campaigns: 100 },
    description: 'Number of logs by resource',
  })
  logsByResource: Record<string, number>;

  @ApiProperty({
    type: Object,
    example: { user123: 100, user456: 200 },
    description: 'Number of logs by user',
  })
  logsByUser: Record<string, number>;
}
