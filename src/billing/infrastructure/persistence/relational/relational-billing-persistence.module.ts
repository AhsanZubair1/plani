import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BillingCodeEntity } from './entities/billing-code.entity';
import { BillingCodeRepository } from './repositories/billing-code.repository';
import { BillingCodeAbstractRepository } from '@src/billing/infrastructure/persistence/billing-code.abstract.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BillingCodeEntity])],
  providers: [
    {
      provide: BillingCodeAbstractRepository,
      useClass: BillingCodeRepository,
    },
  ],
  exports: [BillingCodeAbstractRepository],
})
export class RelationalBillingPersistenceModule {}
