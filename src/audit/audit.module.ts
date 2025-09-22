import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { TestAuditController } from './test-audit.controller';
import { AuditAnalyticsController } from './controllers/audit-analytics.controller';
import { EntityAuditAnalyticsController } from './controllers/entity-audit-analytics.controller';
import { AuditSubscriber } from './subscribers/audit.subscriber';
import { AuditCleanupTask } from './tasks/audit-cleanup.task';
import { RelationalAuditPersistenceModule } from './infrastructure/persistence/relational/relational-audit-persistence.module';
import { BulkAuditService } from './services/bulk-audit.service';
import { SqlAuditService } from './services/sql-audit.service';
import { AuditStatisticsService } from './services/audit-statistics.service';
import { EntityAuditAnalyticsService } from './services/entity-audit-analytics.service';
import { DatabaseAuditInterceptor } from './interceptors/database-audit.interceptor';
import { ModelAuditInterceptor } from './interceptors/model-audit.interceptor';
import { AuditLogEntity } from './infrastructure/persistence/relational/entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLogEntity]),
    ScheduleModule.forRoot(),
    RelationalAuditPersistenceModule,
  ],
  controllers: [
    AuditController,
    TestAuditController,
    AuditAnalyticsController,
    EntityAuditAnalyticsController,
  ],
  providers: [
    AuditService,
    AuditSubscriber,
    AuditCleanupTask,
    BulkAuditService,
    SqlAuditService,
    AuditStatisticsService,
    EntityAuditAnalyticsService,
    DatabaseAuditInterceptor,
    ModelAuditInterceptor,
  ],
  exports: [
    AuditService,
    BulkAuditService,
    SqlAuditService,
    AuditStatisticsService,
    EntityAuditAnalyticsService,
    DatabaseAuditInterceptor,
    ModelAuditInterceptor,
  ],
})
export class AuditModule {}
