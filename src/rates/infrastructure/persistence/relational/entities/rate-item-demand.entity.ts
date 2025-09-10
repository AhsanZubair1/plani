import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RateItemEntity } from './rate-item.entity';
import { RatePeriodEntity } from './rate-period.entity';

@Entity({ name: 'rate_item_demands' })
export class RateItemDemandEntity {
  @PrimaryGeneratedColumn()
  rate_item_demand_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  min_kw: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  max_kw: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  charge: number;

  @Column({ type: 'int' })
  rate_item_id: number;

  @Column({ type: 'int' })
  measurement_period_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => RateItemEntity, (rateItem) => rateItem.demands, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rate_item_id' })
  rateItem: RateItemEntity;

  @ManyToOne(() => RatePeriodEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'measurement_period_id' })
  measurementPeriod: RatePeriodEntity;
}
