import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BillingCodeType } from './billing-code-type.entity';
import { PlanEntity } from './plan.entity';

@Entity('billing_code')
export class BillingCode {
  @PrimaryGeneratedColumn()
  billing_code_id: number;

  @Column({ type: 'varchar', length: 255 })
  billing_code: string;

  @Column({ type: 'int', nullable: true })
  billing_code_type_id: number;

  @Column({ type: 'int', nullable: true })
  plan_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => BillingCodeType,
    (billingCodeType) => billingCodeType.billingCodes,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'billing_code_type_id' })
  billingCodeType: BillingCodeType;

  @ManyToOne(() => PlanEntity, (plan) => plan.billingCodes, {
    nullable: true,
  })
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity;
}
