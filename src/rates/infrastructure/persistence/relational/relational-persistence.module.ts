import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RatesAbstractRepository } from '@src/rates/infrastructure/persistence/rates.abstract.repository';

import { FuelTypeEntity } from './entities/fuel-type.entity';
import { RateCardEntity } from './entities/rate-card.entity';
import { RateCategoryEntity } from './entities/rate-category.entity';
import { RateClassEntity } from './entities/rate-class.entity';
import { RateSeasonEntity } from './entities/rate-season.entity';
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
