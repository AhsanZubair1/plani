import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BillingCode } from './billing-code.entity';

@Entity('billing_code_type')
export class BillingCodeType {
  @PrimaryGeneratedColumn()
  billing_code_type_id: number;

  @Column({ type: 'varchar', length: 255 })
  billing_code_type: string;

  @Column({ type: 'varchar', length: 255 })
  billing_code_type_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => BillingCode, (billingCode) => billingCode.billingCodeType)
  billingCodes: BillingCode[];
}
