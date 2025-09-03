import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BillingCodeEntity } from './billing-code.entity';

@Entity({ name: 'billing_code_types' })
export class BillingCodeTypeEntity {
  @PrimaryGeneratedColumn()
  billing_code_type_id: number;

  @Column({ type: 'varchar', length: 100 })
  billing_code_type: string;

  @Column({ type: 'varchar', length: 100, name: 'billing_code_type_name' })
  billingCodeTypeName: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(
    () => BillingCodeEntity,
    (billingCode) => billingCode.billingCodeType,
  )
  billingCodes: BillingCodeEntity[];
}
