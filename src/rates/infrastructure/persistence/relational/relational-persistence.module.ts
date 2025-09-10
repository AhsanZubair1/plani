import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RatesAbstractRepository } from '@src/rates/infrastructure/persistence/rates.abstract.repository';

import { FuelTypeEntity } from './entities/fuel-type.entity';
import { RateBlockEntity } from './entities/rate-block.entity';
import { RateCardEntity } from './entities/rate-card.entity';
import { RateCategoryEntity } from './entities/rate-category.entity';
import { RateClassEntity } from './entities/rate-class.entity';
import { RateItemBlockEntity } from './entities/rate-item-block.entity';
import { RateItemDemandEntity } from './entities/rate-item-demand.entity';
import { RateItemTimingEntity } from './entities/rate-item-timing.entity';
import { RateItemEntity } from './entities/rate-item.entity';
import { RatePeriodEntity } from './entities/rate-period.entity';
import { RateSeasonEntity } from './entities/rate-season.entity';
import { RateTimingEntity } from './entities/rate-timing.entity';
import { RateTypeEntity } from './entities/rate-type.entity';
import { RateEntity } from './entities/rate.entity';
import { TariffTypeEntity } from './entities/tariff-type.entity';
import { RatesRelationalRepository } from './repositories/rates.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FuelTypeEntity,
      TariffTypeEntity,
      RateCardEntity,
      RateClassEntity,
      RateTypeEntity,
      RateCategoryEntity,
      RateEntity,
      RateSeasonEntity,
      RateBlockEntity,
      RateTimingEntity,
      RateItemEntity,
      RateItemTimingEntity,
      RateItemBlockEntity,
      RateItemDemandEntity,
      RatePeriodEntity,
    ]),
  ],
  providers: [
    {
      provide: RatesAbstractRepository,
      useClass: RatesRelationalRepository,
    },
  ],
  exports: [RatesAbstractRepository],
})
export class RelationalRatePersistenceModule {}
