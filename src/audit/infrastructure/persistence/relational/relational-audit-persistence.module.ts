import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { AuditLogAbstractRepository } from '../audit-log.abstract.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [
    {
      provide: AuditLogAbstractRepository,
      useClass: AuditLogRepository,
    },
  ],
  exports: [AuditLogAbstractRepository],
})
export class RelationalAuditPersistenceModule {}
