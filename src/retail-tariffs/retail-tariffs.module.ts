import { Module } from '@nestjs/common';

import { RelationalretailTariffsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { retailTariffsController } from './retail-tariffs.controller';
import { retailTariffsService } from './retail-tariffs.service';

@Module({
  imports: [RelationalretailTariffsPersistenceModule],
  controllers: [retailTariffsController],
  providers: [retailTariffsService],
  exports: [retailTariffsService, RelationalretailTariffsPersistenceModule],
})
export class retailTariffsModule {}
