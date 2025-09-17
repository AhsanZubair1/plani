import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'plan_bundle' })
export class PlanBundleEntity {
  @PrimaryGeneratedColumn('increment')
  plan_bundle_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  plan_bundle_code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  plan_bundle_name: string;

  @OneToMany(() => PlanEntity, (plan) => plan.planBundle)
  plans: PlanEntity[];
}
