import { Module } from '@nestjs/common';

import { RelationalnetworkTarrifPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { networkTarrifsController } from './network-tarrifs.controller';
import { networkTarrifsService } from './network-tarrifs.service';

@Module({
  imports: [RelationalnetworkTarrifPersistenceModule],
  controllers: [networkTarrifsController],
  providers: [networkTarrifsService],
  exports: [networkTarrifsService, RelationalnetworkTarrifPersistenceModule],
})
export class networkTarrifsModule {}
