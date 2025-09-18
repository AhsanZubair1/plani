import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { TestAuditController } from './test-audit.controller';
import { AuditSubscriber } from './subscribers/audit.subscriber';
import { AuditCleanupTask } from './tasks/audit-cleanup.task';
import { RelationalAuditPersistenceModule } from './infrastructure/persistence/relational/relational-audit-persistence.module';
import { BulkAuditService } from './services/bulk-audit.service';
import { SqlAuditService } from './services/sql-audit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ScheduleModule.forRoot(),
    RelationalAuditPersistenceModule,
  ],
  controllers: [AuditController, TestAuditController],
  providers: [
    AuditService,
    AuditSubscriber,
    AuditCleanupTask,
    BulkAuditService,
    SqlAuditService,
  ],
  exports: [AuditService, BulkAuditService, SqlAuditService],
})
export class AuditModule {}
