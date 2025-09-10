import { Module } from '@nestjs/common';

import { ChargesController } from './charges.controller';
import { ChargesService } from './charges.service';
import { RelationalChargePersistenceModule } from './infrastructure/persistence/relational/relational-charge-persistence.module';

@Module({
  imports: [RelationalChargePersistenceModule],
  controllers: [ChargesController],
  providers: [ChargesService],
  exports: [ChargesService],
})
export class ChargesModule {}
