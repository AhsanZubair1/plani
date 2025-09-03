import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlanAbstractRepository } from '@src/plans/infrastructure/persistence/plan.abstract.repository';
import { PlanTypeEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan-type.entity';
import { ZoneEntity } from '@src/plans/infrastructure/persistence/relational/entities/zone.entity';

import { PlanEntity } from './entities/plan.entity';
import { PlansRelationalRepository } from './repositories/plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity, ZoneEntity, PlanTypeEntity])],
  providers: [
    {
      provide: PlanAbstractRepository,
      useClass: PlansRelationalRepository,
    },
  ],
  exports: [PlanAbstractRepository],
})
export class RelationalPlanPersistenceModule {}
