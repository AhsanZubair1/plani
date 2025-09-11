import { Module } from '@nestjs/common';

import { FuelTypeController } from '@src/rates/controllers/fuel-type.controller';
import { FuelTypeService } from '@src/rates/fuel-type.service';

import { RelationalRatePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PlanRatesQueryService } from './services/plan-rates-query.service';

@Module({
  imports: [RelationalRatePersistenceModule],
  controllers: [FuelTypeController],
  providers: [FuelTypeService, PlanRatesQueryService],
  exports: [
    FuelTypeService,
    PlanRatesQueryService,
    RelationalRatePersistenceModule,
  ],
})
export class RatesModule {}
