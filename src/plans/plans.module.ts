import { Module } from '@nestjs/common';

import { RatesModule } from '@src/rates/rates.module';

import { RelationalPlanPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [RelationalPlanPersistenceModule, RatesModule],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService, RelationalPlanPersistenceModule],
})
export class PlansModule {}
