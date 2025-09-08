import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChargeCategoryEntity } from './charge-category.entity';
import { ChargeTermEntity } from './charge-term.entity';
import { ChargeTypeEntity } from './charge-type.entity';
import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'charges' })
export class ChargeEntity {
  @PrimaryGeneratedColumn()
  charge_id: number;

  @Column({ type: 'varchar', length: 50 })
  charge_code: string;

  @Column({ type: 'varchar', length: 255 })
  charge_description: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  charge_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  charge_perc: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  greenpower_perc: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference_01: string;

  // Foreign Key Columns
  @Column({ type: 'int' })
  plan_id: number;

  @Column({ type: 'int' })
  charge_type_id: number;

  @Column({ type: 'int' })
  charge_category_id: number;

  @Column({ type: 'int' })
  charge_term_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => PlanEntity, (plan) => plan.charges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity;

  @ManyToOne(() => ChargeTypeEntity, (chargeType) => chargeType.charges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'charge_type_id' })
  chargeType: ChargeTypeEntity;

  @ManyToOne(
    () => ChargeCategoryEntity,
    (chargeCategory) => chargeCategory.charges,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'charge_category_id' })
  chargeCategory: ChargeCategoryEntity;

  @ManyToOne(() => ChargeTermEntity, (chargeTerm) => chargeTerm.charges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'charge_term_id' })
  chargeTerm: ChargeTermEntity;
}
