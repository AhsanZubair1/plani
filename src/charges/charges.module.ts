import { Module } from '@nestjs/common';

import { RelationalChargePersistenceModule } from './infrastructure/persistence/relational/relational-charge-persistence.module';
import { ChargesService } from './charges.service';
import { ChargesController } from './charges.controller';

@Module({
  imports: [RelationalChargePersistenceModule],
  controllers: [ChargesController],
  providers: [ChargesService],
  exports: [ChargesService],
})
export class ChargesModule {}
