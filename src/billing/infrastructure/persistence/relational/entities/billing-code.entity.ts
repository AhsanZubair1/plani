import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BillingCodeTypeEntity } from './billing-code-type.entity';
import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'billing_codes' })
export class BillingCodeEntity {
  @PrimaryGeneratedColumn()
  billing_code_id: number;

  @Column({ type: 'varchar', length: 50 })
  billing_code: string;

  // Foreign Key Columns
  @Column({ type: 'int' })
  billing_code_type_id: number;

  @Column({ type: 'int' })
  plan_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => BillingCodeTypeEntity,
    (billingCodeType) => billingCodeType.billingCodes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'billing_code_type_id' })
  billingCodeType: BillingCodeTypeEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.billingCodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity;
}
