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

@Entity({ name: 'rate_item_timings' })
export class RateItemTimingEntity {
  @PrimaryGeneratedColumn()
  rate_item_timing_id: number;

  @Column({ type: 'time' })
  time_band_start: string;

  @Column({ type: 'time' })
  time_band_end: string;

  @Column({ type: 'boolean', default: false })
  weekdays: boolean;

  @Column({ type: 'boolean', default: false })
  weekend_sat: boolean;

  @Column({ type: 'boolean', default: false })
  weekend_sun: boolean;

  @Column({ type: 'int' })
  rate_item_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => RateItemEntity, (rateItem) => rateItem.timings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rate_item_id' })
  rateItem: RateItemEntity;
}
