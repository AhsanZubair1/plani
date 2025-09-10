import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { RateItemEntity } from './rate-item.entity';
import { RatePeriodEntity } from './rate-period.entity';

@Entity({ name: 'rate_item_demands' })
export class RateItemDemandEntity {
  @PrimaryGeneratedColumn('increment')
  rate_item_demand_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: false })
  min_kw: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  max_kw: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: false })
  charge: number;

  @Column({ type: 'int', nullable: true })
  rate_item_id: number | null;

  @Column({ type: 'int', nullable: true })
  measurement_period_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToOne(() => RateItemEntity, (rateItem) => rateItem.demand, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rate_item_id' })
  rateItem: RateItemEntity | null;

  @ManyToOne(() => RatePeriodEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'measurement_period_id' })
  measurementPeriod: RatePeriodEntity | null;
}
