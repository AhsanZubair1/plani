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
  @PrimaryGeneratedColumn('increment')
  rate_item_timing_id: number;

  @Column({ type: 'time', nullable: false })
  time_band_start: string;

  @Column({ type: 'time', nullable: false })
  time_band_end: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  weekdays: boolean | null;

  @Column({ type: 'boolean', default: false, nullable: true })
  weekend_sat: boolean | null;

  @Column({ type: 'boolean', default: false, nullable: true })
  weekend_sun: boolean | null;

  @Column({ type: 'int', nullable: true })
  rate_item_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => RateItemEntity, (rateItem) => rateItem.timings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rate_item_id' })
  rateItem: RateItemEntity | null;
}
