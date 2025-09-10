import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'rate_blocks' })
export class RateBlockEntity {
  @PrimaryGeneratedColumn('increment')
  rate_block_id: number;

  @Column({ type: 'varchar', length: 100 })
  rate_block_name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 5 })
  start_time: string;

  @Column({ type: 'varchar', length: 5 })
  end_time: string;

  @Column({ type: 'json' })
  days_of_week: string[];

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  rate_per_kwh: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  supply_charge_per_day: number;

  @Column({ type: 'varchar', length: 50 })
  rate_type: string;

  @Column({ type: 'varchar', length: 50 })
  season: string;

  @Column({ type: 'date' })
  effective_from: Date;

  @Column({ type: 'date' })
  effective_to: Date;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int' })
  plan_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => PlanEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity;
}
