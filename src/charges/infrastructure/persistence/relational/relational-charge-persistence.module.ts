import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChargeAbstractRepository } from '@src/charges/infrastructure/persistence/charge.abstract.repository';

import { ChargeEntity } from './entities/charge.entity';
import { ChargeRepository } from './repositories/charge.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChargeEntity])],
  providers: [
    {
      provide: ChargeAbstractRepository,
      useClass: ChargeRepository,
    },
  ],
  exports: [ChargeAbstractRepository],
})
export class RelationalChargePersistenceModule {}
