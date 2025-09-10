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

import { ChargeEntity } from '@src/charges/infrastructure/persistence/relational/entities/charge.entity';
import { PlanTypeEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan-type.entity';
import { ZoneEntity } from '@src/plans/infrastructure/persistence/relational/entities/zone.entity';
import { RateCardEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-card.entity';
import { customerTypeEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/customer-type.entity';
import { distributorEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/distributor.entity';
import { retailTariffsEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/retail-tariffs.entity';

@Entity({ name: 'plans' })
export class PlanEntity {
  @PrimaryGeneratedColumn('increment')
  plan_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  int_plan_code: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  ext_plan_code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  plan_name: string;

  @Column({ type: 'date', nullable: false })
  effective_from: Date;

  @Column({ type: 'date', nullable: true })
  effective_to: Date | null;

  @Column({ type: 'date', nullable: true })
  review_date: Date | null;

  @Column({ type: 'boolean', default: false, nullable: false })
  restricted: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  contingent: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  direct_debit_only: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  ebilling_only: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  solar_cust_only: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  ev_only: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  intrinsic_green: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  intrinsic_gpp: boolean | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  eligibility_criteria: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  price_variation_details: string | null;

  @Column({ type: 'text', nullable: false })
  terms_and_conditions: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  contract_expiry_details: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fixed_rates: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lowest_rps: number | null;

  @Column({ type: 'text', nullable: true })
  factsheet_url: string | null;

  @Column({ type: 'int', nullable: true })
  zone_id: number | null;

  @Column({ type: 'int', nullable: true })
  plan_type_id: number | null;

  @Column({ type: 'int', nullable: true })
  distributor_id: number | null;

  @Column({ type: 'int', nullable: true })
  customer_type_id: number | null;

  @Column({ type: 'int', nullable: true })
  rate_card_id: number | null;

  @Column({ type: 'int', nullable: true })
  contract_term_id: number | null;

  @Column({ type: 'int', nullable: true })
  retail_tariff_id: number | null;

  @Column({ type: 'int', nullable: true })
  bill_freq_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // EXTRA
  @Column({ type: 'varchar', length: 50, nullable: true })
  billing_code: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  billing_code_type: string | null;

  @Column({ type: 'int', nullable: true })
  billing_cycle_days: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  billing_frequency: string | null;

  @Column({ type: 'int', nullable: true })
  due_date_offset_days: number | null;

  @Column({ type: 'boolean', default: false, nullable: false })
  has_time_based_rates: boolean;

  @Column({ type: 'text', nullable: true })
  rate_structure_description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  default_rate_per_kwh: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  default_supply_charge_per_day: number | null;
  //

  @ManyToOne(() => ZoneEntity, (zone) => zone.plans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity | null;

  @ManyToOne(() => PlanTypeEntity, (planType) => planType.plans, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'plan_type_id' })
  planType: PlanTypeEntity | null;

  @ManyToOne(() => distributorEntity, (distributor) => distributor.plans, {
    nullable: true,
  })
  @JoinColumn({ name: 'distributor_id' })
  distributor: distributorEntity | null;

  @ManyToOne(() => customerTypeEntity, (customerType) => customerType.plans, {
    nullable: true,
  })
  @JoinColumn({ name: 'customer_type_id' })
  customerType: customerTypeEntity | null;

  @ManyToOne(() => RateCardEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'rate_card_id' })
  rateCard: RateCardEntity | null;

  @ManyToOne(() => retailTariffsEntity, (retailTariff) => retailTariff.plans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'retail_tariff_id' })
  retailTariff: retailTariffsEntity | null;

  @OneToMany(() => ChargeEntity, (charge) => charge.plan)
  charges: ChargeEntity[];
}
