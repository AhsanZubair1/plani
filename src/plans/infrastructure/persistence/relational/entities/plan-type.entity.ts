import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'plan_types' })
export class PlanTypeEntity {
  @PrimaryGeneratedColumn('increment')
  plan_type_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  plan_type_code: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  plan_type_name: string;

  @OneToMany(() => PlanEntity, (plan) => plan.planType)
  plans: PlanEntity[];
}
