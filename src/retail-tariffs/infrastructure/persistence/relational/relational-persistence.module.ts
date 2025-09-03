import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { retailTariffsAbstractRepository } from '@src/retail-tariffs/infrastructure/persistence/retail-tariffs.abstract.repository';

import { retailTariffsEntity } from './entities/retail-tariffs.entity';
import { retailTariffsRelationalRepository } from './repositories/retail-tariffs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([retailTariffsEntity])],
  providers: [
    {
      provide: retailTariffsAbstractRepository,
      useClass: retailTariffsRelationalRepository,
    },
  ],
  exports: [retailTariffsAbstractRepository],
})
export class RelationalretailTariffsPersistenceModule {}
