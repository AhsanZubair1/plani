import { Module } from '@nestjs/common';

import { RelationalPlanPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [RelationalPlanPersistenceModule],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService, RelationalPlanPersistenceModule],
})
export class PlansModule {}
