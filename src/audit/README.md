# Comprehensive Audit Logging System

A Django-inspired audit logging system for NestJS applications that provides comprehensive tracking of all user actions, database changes, and system events.

## Features

- **Comprehensive Logging**: Track all CRUD operations, user actions, and system events
- **Automatic Database Tracking**: TypeORM subscribers automatically log all entity changes
- **Flexible Decorators**: Use `@Audit` decorator for automatic method-level logging
- **Request/Response Logging**: Global interceptor logs all API requests and responses
- **Advanced Querying**: Search and filter audit logs with complex queries
- **Export Functionality**: Export audit logs in JSON or CSV format
- **Retention Policies**: Automatic cleanup of old audit logs
- **Security**: Sensitive data is automatically redacted
- **Performance**: Optimized for high-volume applications

## Quick Start

### 1. Install Dependencies

```bash
npm install @nestjs/schedule uuid
npm install --save-dev @types/uuid
```

### 2. Add Audit Module to App Module

```typescript
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    // ... other modules
    AuditModule,
  ],
})
export class AppModule {}
```

### 3. Use Audit Decorators

```typescript
import { Audit } from './audit/decorators/audit.decorator';
import { AuditAction } from './audit/domain/audit-log';

@Controller('plans')
export class PlansController {
  @Post()
  @Audit({
    action: AuditAction.CREATE,
    resource: 'Plan',
    message: 'Creating new plan',
    includeRequest: true,
    includeResponse: true,
    resourceIdPath: 'data.id',
  })
  async create(@Body() createPlanDto: CreatePlanDto) {
    // Your business logic
  }
}
```

### 4. Manual Audit Logging

```typescript
import { AuditService } from './audit/audit.service';

@Injectable()
export class PlansService {
  constructor(private readonly auditService: AuditService) {}

  async createPlan(data: any, user: any) {
    const plan = await this.planRepository.save(data);

    await this.auditService.logCreate(
      'Plan',
      plan,
      {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      },
      plan.id,
    );

    return plan;
  }
}
```

## Architecture

### Domain Layer

- `AuditLog`: Core domain entity
- `AuditAction`: Enum of all possible actions
- `AuditLevel`: Log levels (INFO, WARNING, ERROR, CRITICAL)

### Infrastructure Layer

- `AuditLogEntity`: TypeORM entity for database persistence
- `AuditLogRepository`: Repository for database operations
- `AuditSubscriber`: TypeORM subscriber for automatic entity tracking

### Application Layer

- `AuditService`: Main service for audit operations
- `AuditController`: REST API endpoints
- `AuditInterceptor`: Global request/response logging
- `GlobalAuditInterceptor`: Comprehensive API logging

### Presentation Layer

- `@Audit` decorator for method-level logging
- DTOs for API requests and responses
- Swagger documentation

## API Endpoints

### Get Audit Logs

```http
GET /api/audit/logs?userId=user123&resource=plans&action=CREATE&limit=100&offset=0
```

### Get Audit Trail for Resource

```http
GET /api/audit/trail/plans/123
```

### Get User Activity

```http
GET /api/audit/user/user123/activity
```

### Get Audit Statistics

```http
GET /api/audit/stats?startDate=2024-01-01&endDate=2024-12-31
```

### Export Audit Logs

```http
POST /api/audit/export?format=csv&userId=user123&startDate=2024-01-01
```

### Cleanup Old Logs

```http
POST /api/audit/cleanup?retentionDays=90
```

## Configuration

### Environment Variables

```env
# Audit retention in days
AUDIT_RETENTION_DAYS=90

# Enable/disable audit logging
AUDIT_ENABLED=true

# Log level for audit entries
AUDIT_LOG_LEVEL=INFO

# Maximum response size to log (bytes)
AUDIT_MAX_RESPONSE_SIZE=10000
```

### Global Configuration

```typescript
// In your app module
const auditConfig = {
  enabled: process.env.AUDIT_ENABLED === 'true',
  retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '90'),
  logLevel: process.env.AUDIT_LOG_LEVEL || 'INFO',
  maxResponseSize: parseInt(process.env.AUDIT_MAX_RESPONSE_SIZE || '10000'),
};
```

## Advanced Usage

### Custom Audit Actions

```typescript
// Add custom actions to the enum
export enum AuditAction {
  // ... existing actions
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
}
```

### Sensitive Data Redaction

The system automatically redacts sensitive fields:

```typescript
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
```

### Custom Metadata

```typescript
await this.auditService.log(
  AuditAction.CREATE,
  'Plan',
  'Created plan with custom metadata',
  context,
  {
    metadata: {
      planType: 'residential',
      distributor: 'CitiPower',
      state: 'VIC',
      customField: 'customValue',
    },
    tags: ['plans', 'residential', 'victoria'],
  },
);
```

### Bulk Operations

```typescript
await this.auditService.log(
  AuditAction.BULK_UPDATE,
  'Plan',
  'Bulk updated 100 plans',
  context,
  {
    newValues: { affectedIds: [1, 2, 3], updates: { status: 'active' } },
    metadata: { operation: 'bulk_update', count: 100 },
    tags: ['plans', 'bulk', 'update'],
  },
);
```

## Database Schema

The audit system creates an `audit_logs` table with the following structure:

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50),
  user_name VARCHAR(100),
  user_email VARCHAR(255),
  session_id VARCHAR(100),
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id VARCHAR(100),
  old_values JSONB,
  new_values JSONB,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  request_id VARCHAR(100),
  method VARCHAR(10),
  url VARCHAR(500),
  status_code INTEGER,
  response_time INTEGER,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  tags VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audit_logs_user_id_created_at ON audit_logs(user_id, created_at);
CREATE INDEX idx_audit_logs_action_resource ON audit_logs(action, resource);
CREATE INDEX idx_audit_logs_resource_resource_id ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_logs_level_created_at ON audit_logs(level, created_at);
CREATE INDEX idx_audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX idx_audit_logs_request_id ON audit_logs(request_id);
```

## Performance Considerations

### Indexing

- All commonly queried fields are indexed
- Composite indexes for complex queries
- Partial indexes for frequently filtered data

### Data Retention

- Automatic cleanup of old logs
- Configurable retention periods
- Separate retention for sensitive data

### Response Size Limits

- Large responses are truncated
- Sensitive data is redacted
- Configurable size limits

### Async Logging

- All audit logging is asynchronous
- Non-blocking for main application flow
- Error handling prevents audit failures from affecting business logic

## Security Features

### Data Redaction

- Automatic redaction of sensitive fields
- Configurable sensitive field list
- Deep object sanitization

### Access Control

- JWT authentication required for audit endpoints
- Role-based access control (implement as needed)
- Audit log access is itself audited

### Data Integrity

- Immutable audit logs
- Cryptographic hashing for critical operations
- Tamper detection mechanisms

## Monitoring and Alerting

### Health Checks

```typescript
@Get('health')
async getAuditHealth() {
  const stats = await this.auditService.getAuditStats();
  return {
    status: 'healthy',
    totalLogs: stats.totalLogs,
    lastLogTime: new Date(),
  };
}
```

### Metrics

- Total audit logs
- Logs by action type
- Logs by user
- Error rates
- Performance metrics

### Alerts

- Failed audit log creation
- Unusual activity patterns
- High error rates
- Storage space usage

## Troubleshooting

### Common Issues

1. **Audit logs not being created**

   - Check if audit module is imported
   - Verify database connection
   - Check audit service initialization

2. **Performance issues**

   - Review database indexes
   - Check response size limits
   - Monitor async logging performance

3. **Missing data in logs**
   - Verify user context is available
   - Check sensitive data redaction
   - Review audit decorator configuration

### Debug Mode

```typescript
// Enable debug logging
const auditConfig = {
  debug: true,
  logLevel: 'DEBUG',
};
```

## Migration from Django Audit

If migrating from Django's audit system:

1. **Data Migration**: Export Django audit logs and import into new system
2. **Action Mapping**: Map Django actions to new AuditAction enum
3. **User Context**: Ensure user information is properly passed
4. **Retention Policies**: Configure similar retention periods
5. **API Compatibility**: Create compatibility layer if needed

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure backward compatibility
5. Follow security best practices

## License

This audit logging system is part of the MINDEF-GC-CMS-API project and follows the same license terms.
