# Django-Style Model Audit Logging System

This document describes the Django-style audit logging system implemented for comprehensive entity tracking and percentage calculations.

## Overview

The Django-style audit system provides:

- **Automatic entity auditing** using decorators
- **Field-level change tracking** for UPDATE operations
- **Percentage-based analytics** from audit logs
- **Time-based statistics** and trends
- **Entity comparison** capabilities
- **Sensitive operation handling**

## Features

### 1. Model Audit Decorators

#### Basic Decorators

```typescript
// Create operations
@AuditCreate('plans', {
  message: 'Plan created successfully',
  resourceIdPath: 'data.plan_id'
})
async createPlan(dto: CreatePlanDto) { ... }

// Read operations
@AuditRead('plans', {
  includeQuery: true,
  tags: ['search', 'filter']
})
async getPlans(query: QueryPlanDto) { ... }

// Update operations with field tracking
@AuditUpdate('plans', {
  trackFieldChanges: true,
  excludeFields: ['updated_at'],
  includeFields: ['plan_name', 'effective_from']
})
async updatePlan(id: number, dto: UpdatePlanDto) { ... }

// Delete operations
@AuditDelete('plans', {
  message: 'Plan deleted successfully',
  resourceIdPath: 'params.planId'
})
async deletePlan(id: number) { ... }
```

#### Advanced Decorators

```typescript
// Bulk operations
@AuditBulk('plans', AuditAction.CREATE, {
  metadataExtractor: (request, response) => ({
    recordCount: request.body?.plans?.length || 0,
    source: 'bulk_import'
  })
})
async bulkCreatePlans(plans: CreatePlanDto[]) { ... }

// Sensitive operations
@AuditSensitive('plans', AuditAction.UPDATE, {
  level: AuditLevel.WARNING,
  includeRequest: false,
  includeResponse: false
})
async updatePlanPricing(id: number, pricing: any) { ... }

// Custom configuration
@ModelAudit({
  action: AuditAction.UPDATE,
  resource: 'plans',
  trackFieldChanges: true,
  resourceIdExtractor: (response) => response?.data?.plan_id,
  metadataExtractor: (request, response) => ({
    previousStatus: request.body?.previous_status,
    newStatus: response?.data?.plan_status_id
  })
})
async changePlanStatus(id: number, status: any) { ... }
```

### 2. Entity Audit Analytics

#### Get Entity Statistics

```typescript
// Get comprehensive stats for an entity
const stats = await entityAuditAnalyticsService.getEntityAuditStats(
  'plans',
  startDate,
  endDate,
);
// Returns: totalOperations, createOperations, readOperations, updateOperations,
//          deleteOperations, uniqueRecords, averageOperationsPerRecord,
//          lastActivity, activityTrend
```

#### Get Percentage Statistics

```typescript
// Get percentage-based stats compared to all entities
const percentages =
  await entityAuditAnalyticsService.getEntityPercentageStats('plans');
// Returns: percentageOfTotalAudits, percentageOfCreateOperations,
//          percentageOfReadOperations, percentageOfUpdateOperations,
//          percentageOfDeleteOperations, mostActiveEntity, leastActiveEntity
```

#### Compare Entities

```typescript
// Compare two entities
const comparison = await entityAuditAnalyticsService.getEntityComparisonStats(
  'plans',
  'campaigns',
);
// Returns: entity1Percentage, entity2Percentage, operationComparison
```

#### Time-Based Analytics

```typescript
// Get time-based statistics
const timeStats = await entityAuditAnalyticsService.getTimeBasedAuditStats(
  'plans',
  startDate,
  endDate,
);
// Returns: hourlyStats, dailyStats, weeklyStats, monthlyStats with percentages
```

### 3. API Endpoints

#### Entity Statistics

- `GET /api/v1/audit/analytics/entities/stats/:entity` - Get entity audit statistics
- `GET /api/v1/audit/analytics/entities/percentages/:entity` - Get percentage statistics
- `GET /api/v1/audit/analytics/entities/compare/:entity1/:entity2` - Compare entities
- `GET /api/v1/audit/analytics/entities/time-based/:entity` - Get time-based stats

#### All Entities

- `GET /api/v1/audit/analytics/entities/all/stats` - Get stats for all entities
- `GET /api/v1/audit/analytics/entities/all/percentages` - Get percentages for all entities

### 4. Integration with Existing Campaign Analytics

The new audit system integrates seamlessly with the existing campaign repository analytics:

```typescript
// Enhanced campaign repository with audit-based percentages
async getChannelsWithCampaigns(): Promise<any> {
  // ... existing logic ...

  // Get audit statistics for plans
  const planAuditStats = await this.entityAuditAnalyticsService.getEntityPercentageStats('plans');

  // Calculate percentages based on audit data
  const auditBasedPercentages = {
    planQueriesPercentage: planAuditStats.percentageOfReadOperations,
    planCreationsPercentage: planAuditStats.percentageOfCreateOperations,
    planUpdatesPercentage: planAuditStats.percentageOfUpdateOperations,
    planDeletionsPercentage: planAuditStats.percentageOfDeleteOperations,
    totalAuditPercentage: planAuditStats.percentageOfTotalAudits
  };

  return {
    // ... existing data ...
    auditBasedPercentages
  };
}
```

## Usage Examples

### 1. Basic Entity Auditing

```typescript
@Injectable()
export class PlansService {
  @AuditCreate('plans')
  async create(dto: CreatePlanDto) {
    // Implementation
  }

  @AuditRead('plans')
  async findAll(query: QueryPlanDto) {
    // Implementation
  }

  @AuditUpdate('plans')
  async update(id: number, dto: UpdatePlanDto) {
    // Implementation
  }

  @AuditDelete('plans')
  async remove(id: number) {
    // Implementation
  }
}
```

### 2. Advanced Field Tracking

```typescript
@AuditUpdate('plans', {
  trackFieldChanges: true,
  includeFields: ['plan_name', 'effective_from', 'effective_to', 'restricted'],
  excludeFields: ['updated_at', 'last_modified'],
  metadata: {
    changeReason: 'admin_update'
  }
})
async updatePlan(id: number, dto: UpdatePlanDto) {
  // Only specified fields will be tracked for changes
}
```

### 3. Bulk Operations

```typescript
@AuditBulk('plans', AuditAction.CREATE, {
  metadataExtractor: (request, response) => ({
    recordCount: response?.data?.length || 0,
    source: 'csv_import',
    fileName: request.body?.fileName
  })
})
async bulkCreate(plans: CreatePlanDto[]) {
  // Bulk creation with audit logging
}
```

### 4. Analytics Integration

```typescript
@Injectable()
export class CampaignAnalyticsService {
  constructor(
    private readonly entityAuditAnalytics: EntityAuditAnalyticsService,
  ) {}

  async getChannelAuditPercentages(channelId: number) {
    // Get audit statistics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const planStats = await this.entityAuditAnalytics.getEntityPercentageStats(
      'plans',
      thirtyDaysAgo,
      new Date(),
    );

    const campaignStats =
      await this.entityAuditAnalytics.getEntityPercentageStats(
        'campaigns',
        thirtyDaysAgo,
        new Date(),
      );

    return {
      planActivityPercentage: planStats.percentageOfTotalAudits,
      campaignActivityPercentage: campaignStats.percentageOfTotalAudits,
      planReadPercentage: planStats.percentageOfReadOperations,
      campaignReadPercentage: campaignStats.percentageOfReadOperations,
    };
  }
}
```

## Configuration

### Global Audit Configuration

```typescript
// audit.config.ts
export const getAuditConfig = () => ({
  enabled: true,
  logReads: true,
  logWrites: true,
  logDeletes: true,
  logRawQueries: false,
  sensitiveEntities: ['users', 'payments'],
  excludedEntities: ['sessions', 'cache'],
});
```

### Module Registration

```typescript
// app.module.ts
@Module({
  imports: [
    AuditModule, // Includes all audit services and interceptors
    // ... other modules
  ],
  // ...
})
export class AppModule {}
```

## Benefits

1. **Django-style Simplicity**: Easy-to-use decorators similar to Django's audit system
2. **Automatic Tracking**: No manual audit logging required
3. **Field-level Changes**: Track exactly what changed in UPDATE operations
4. **Percentage Analytics**: Get meaningful insights from audit data
5. **Time-based Trends**: Understand usage patterns over time
6. **Entity Comparison**: Compare activity between different entities
7. **Sensitive Operation Handling**: Special handling for sensitive operations
8. **Performance Optimized**: Minimal overhead with efficient logging

## Migration from Existing System

The new system is backward compatible and can be gradually adopted:

1. **Keep existing audit system** for API-level logging
2. **Add model decorators** to new services
3. **Use analytics service** for percentage calculations
4. **Gradually migrate** existing services to use decorators

This approach ensures zero downtime while gaining the benefits of Django-style model auditing and comprehensive percentage analytics.
