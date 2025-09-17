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

import { CampaignPlanRelnEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/campaign-plan-reln.entity';
import { ChannelEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/channel.entity';
import { ChargeEntity } from '@src/charges/infrastructure/persistence/relational/entities/charge.entity';
import { BillingCode } from '@src/plans/infrastructure/persistence/relational/entities/billing-code.entity';
import { PlanTypeEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan-type.entity';
import { ZoneEntity } from '@src/plans/infrastructure/persistence/relational/entities/zone.entity';
import { RateCardEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-card.entity';
import { customerTypeEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/customer-type.entity';
import { distributorEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/distributor.entity';
import { retailTariffsEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/retail-tariffs.entity';

import { PlanBundleEntity } from './plan-bundle.entity';
import { PlanStatusEntity } from './plan-status.entity';
import { RetailerEntity } from './retailer.entity';

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
  cooling_off_bd: number | null;

  @Column({ type: 'int', nullable: true })
  zone_id: number | null;

  @Column({ type: 'int', nullable: false })
  plan_type_id: number;

  @Column({ type: 'int', nullable: false })
  distributor_id: number;

  @Column({ type: 'int', nullable: false })
  customer_type_id: number;

  @Column({ type: 'int', nullable: false })
  rate_card_id: number;

  @Column({ type: 'int', nullable: true })
  contract_term_id: number | null;

  @Column({ type: 'int', nullable: true })
  retail_tariff_id: number | null;

  @Column({ type: 'int', nullable: true })
  bill_freq_id: number | null;

  @Column({ type: 'int', nullable: true })
  retailer_id: number | null;

  @Column({ type: 'int', nullable: true })
  plan_bundle_id: number | null;

  @Column({ type: 'int', nullable: true })
  plan_status_id: number | null;

  @Column({ type: 'int', nullable: true })
  exclusive_channel_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => ZoneEntity, (zone) => zone.plans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity | null;

  @ManyToOne(() => PlanTypeEntity, (planType) => planType.plans, {
    nullable: false,
  })
  @JoinColumn({ name: 'plan_type_id' })
  planType: PlanTypeEntity;

  @ManyToOne(() => distributorEntity, (distributor) => distributor.plans, {
    nullable: false,
  })
  @JoinColumn({ name: 'distributor_id' })
  distributor: distributorEntity;

  @ManyToOne(() => customerTypeEntity, (customerType) => customerType.plans, {
    nullable: false,
  })
  @JoinColumn({ name: 'customer_type_id' })
  customerType: customerTypeEntity;

  @ManyToOne(() => RateCardEntity, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'rate_card_id' })
  rateCard: RateCardEntity;

  @ManyToOne(() => retailTariffsEntity, (retailTariff) => retailTariff.plans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'retail_tariff_id' })
  retailTariff: retailTariffsEntity | null;

  @OneToMany(() => ChargeEntity, (charge) => charge.plan)
  charges: ChargeEntity[];

  @OneToMany(() => CampaignPlanRelnEntity, (reln) => reln.plan)
  campaignPlanRelns: CampaignPlanRelnEntity[];

  @OneToMany(() => BillingCode, (billingCode) => billingCode.plan)
  billingCodes: BillingCode[];

  @ManyToOne(() => RetailerEntity, (retailer) => retailer.plans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'retailer_id' })
  retailer: RetailerEntity | null;

  @ManyToOne(() => PlanBundleEntity, (bundle) => bundle.plans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'plan_bundle_id' })
  planBundle: PlanBundleEntity | null;

  @ManyToOne(() => PlanStatusEntity, (status) => status.plans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'plan_status_id' })
  planStatus: PlanStatusEntity | null;

  @ManyToOne(() => ChannelEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'exclusive_channel_id' })
  exclusiveChannel: ChannelEntity | null;
}
