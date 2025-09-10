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
  @PrimaryGeneratedColumn('increment')
  charge_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  charge_code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  charge_description: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  charge_amount: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  charge_perc: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  greenpower_perc: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference_01: string;

  // Foreign Key Columns
  @Column({ type: 'int', nullable: true })
  plan_id: number | null;

  @Column({ type: 'int', nullable: true })
  charge_type_id: number | null;

  @Column({ type: 'int', nullable: true })
  charge_category_id: number | null;

  @Column({ type: 'int', nullable: true })
  charge_term_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => PlanEntity, (plan) => plan.charges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity | null;

  @ManyToOne(() => ChargeTypeEntity, (chargeType) => chargeType.charges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'charge_type_id' })
  chargeType: ChargeTypeEntity | null;

  @ManyToOne(
    () => ChargeCategoryEntity,
    (chargeCategory) => chargeCategory.charges,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'charge_category_id' })
  chargeCategory: ChargeCategoryEntity | null;

  @ManyToOne(() => ChargeTermEntity, (chargeTerm) => chargeTerm.charges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'charge_term_id' })
  chargeTerm: ChargeTermEntity | null;
}
