import { Module } from '@nestjs/common';

import { RelationalBillingPersistenceModule } from './infrastructure/persistence/relational/relational-billing-persistence.module';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';

@Module({
  imports: [RelationalBillingPersistenceModule],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
