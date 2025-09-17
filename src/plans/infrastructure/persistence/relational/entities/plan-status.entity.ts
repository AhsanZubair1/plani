import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'plan_status' })
export class PlanStatusEntity {
  @PrimaryGeneratedColumn('increment')
  plan_status_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  plan_status_desc: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  plan_status_code: string;

  @OneToMany(() => PlanEntity, (plan) => plan.planStatus)
  plans: PlanEntity[];
}
