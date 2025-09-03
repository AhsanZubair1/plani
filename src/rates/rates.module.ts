import { Module } from '@nestjs/common';

import { FuelTypeController } from '@src/rates/controllers/fuel-type.controller';
import { FuelTypeService } from '@src/rates/fuel-type.service';

import { RelationalRatePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalRatePersistenceModule],
  controllers: [FuelTypeController],
  providers: [FuelTypeService],
  exports: [FuelTypeService],
})
export class RatesModule {}
