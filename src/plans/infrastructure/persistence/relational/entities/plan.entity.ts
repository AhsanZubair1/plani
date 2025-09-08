import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { BillingCodeEntity } from '@src/billing/infrastructure/persistence/relational/entities/billing-code.entity';
import { ChargeEntity } from '@src/charges/infrastructure/persistence/relational/entities/charge.entity';
import { PlanTypeEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan-type.entity';
import { ZoneEntity } from '@src/plans/infrastructure/persistence/relational/entities/zone.entity';
import { RateCardEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-card.entity';
import { customerTypeEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/customer-type.entity';
import { distributorEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/distributor.entity';
import { retailTariffsEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/retail-tariffs.entity';

@Entity({ name: 'plans' })
export class PlanEntity {
  @PrimaryGeneratedColumn()
  plan_id: number;

  @Column({ type: 'varchar', length: 50 })
  int_plan_code: string;

  @Column({ type: 'varchar', length: 50 })
  ext_plan_code: string;

  @Column({ type: 'varchar', length: 255 })
  plan_name: string;

  @Column({ type: 'date' })
  effective_from: Date;

  @Column({ type: 'date' })
  effective_to: Date;

  @Column({ type: 'date' })
  review_date: Date;

  @Column({ type: 'boolean', default: false })
  restricted: boolean;

  @Column({ type: 'boolean', default: false })
  contingent: boolean;

  @Column({ type: 'boolean', default: false })
  direct_debit_only: boolean;

  @Column({ type: 'boolean', default: false })
  ebilling_only: boolean;

  @Column({ type: 'boolean', default: false })
  solar_cust_only: boolean;

  @Column({ type: 'boolean', default: false })
  ev_only: boolean;

  @Column({ type: 'boolean', default: false })
  instrinct_green: boolean;

  @Column({ type: 'varchar', length: 500 })
  eligibility_criteria: string;

  @Column({ type: 'varchar', length: 500 })
  price_variation_details: string;

  @Column({ type: 'text' })
  terms_and_conditions: string;

  @Column({ type: 'varchar', length: 500 })
  contract_expiry_details: string;

  @Column({ type: 'varchar', length: 500 })
  fixed_rates: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  lowest_rps: number;

  // Foreign Key Columns
  @Column({ type: 'int' })
  zone_id: number;

  @Column({ type: 'int' })
  plan_type_id: number;

  @Column({ type: 'int' })
  customer_type_id: number;

  @Column({ type: 'int' })
  distributor_id: number;

  @ManyToOne(() => distributorEntity, (distributor) => distributor.plans)
  @JoinColumn({ name: 'distributor_id' })
  distributor: distributorEntity;

  @ManyToOne(() => customerTypeEntity, (customerType) => customerType.plans)
  @JoinColumn({ name: 'customer_type_id' })
  customerType: customerTypeEntity;

  @Column({ type: 'int' })
  retail_tariff_id: number;

  @Column({ type: 'int' })
  rate_card_id: number;

  @ManyToOne(() => RateCardEntity, { eager: true })
  @JoinColumn({ name: 'rate_card_id' })
  rateCard: RateCardEntity;

  @Column({ type: 'int' })
  contract_term_id: number;

  @Column({ type: 'int' })
  bill_freq_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => PlanTypeEntity, (planType) => planType.plans, {
    onDelete: 'CASCADE', // Optional: define deletion behavior
  })
  @JoinColumn({ name: 'plan_type_id' })
  planType: PlanTypeEntity;

  @ManyToOne(() => ZoneEntity, (zone) => zone.plans, {
    onDelete: 'SET NULL', // Set to null when zone is deleted
    nullable: true, // Make the relationship optional
  })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;

  @OneToMany(() => BillingCodeEntity, (billingCode) => billingCode.plan)
  billingCodes: BillingCodeEntity[];

  @OneToMany(() => ChargeEntity, (charge) => charge.plan)
  charges: ChargeEntity[];

  @ManyToOne(() => retailTariffsEntity, (retailTariff) => retailTariff.plans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'retail_tariff_id' })
  retailTariff: retailTariffsEntity;
}
