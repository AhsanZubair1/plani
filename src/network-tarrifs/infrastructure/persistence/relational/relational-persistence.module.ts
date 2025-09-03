import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { networkTarrifAbstractRepository } from '@src/network-tarrifs/infrastructure/persistence/network-tarrif.abstract.repository';

import { networkTariffEntity } from './entities/network-tarrif.entity';
import { networkTarrifRelationalRepository } from './repositories/network-tarrif.repository';

@Module({
  imports: [TypeOrmModule.forFeature([networkTariffEntity])],
  providers: [
    {
      provide: networkTarrifAbstractRepository,
      useClass: networkTarrifRelationalRepository,
    },
  ],
  exports: [networkTarrifAbstractRepository],
})
export class RelationalnetworkTarrifPersistenceModule {}
