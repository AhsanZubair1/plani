import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RateItemEntity } from './rate-item.entity';
import { RateItemDemandEntity } from './rate-item-demand.entity';

@Entity({ name: 'rate_periods' })
export class RatePeriodEntity {
  @PrimaryGeneratedColumn('increment')
  rate_period_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  rate_period_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  rate_period_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => RateItemEntity, (rateItem) => rateItem.ratePeriod)
  rateItems: RateItemEntity[];

  @OneToMany(() => RateItemDemandEntity, (demand) => demand.measurementPeriod)
  demands: RateItemDemandEntity[];
}
