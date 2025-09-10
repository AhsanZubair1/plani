import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LogAbstractRepository } from '@src/logging/infrastructure/persistence/log.abstract.repository';

import { LogEntity } from './entities/log.entity';
import { LogRepository } from './repositories/log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  providers: [
    {
      provide: LogAbstractRepository,
      useClass: LogRepository,
    },
  ],
  exports: [LogAbstractRepository],
})
export class RelationalLogPersistenceModule {}
