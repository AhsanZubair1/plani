import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RateSeasonEntity } from './rate-season.entity';
import { RateTypeEntity } from './rate-type.entity';
import { RatePeriodEntity } from './rate-period.entity';
import { RateItemTimingEntity } from './rate-item-timing.entity';
import { RateItemBlockEntity } from './rate-item-block.entity';
import { RateItemDemandEntity } from './rate-item-demand.entity';

@Entity({ name: 'rate_items' })
export class RateItemEntity {
  @PrimaryGeneratedColumn('increment')
  rate_item_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  rate_item_name: string;

  @Column({ type: 'text', nullable: true })
  rate_item_details: string | null;

  @Column({ type: 'int', nullable: false })
  rate_season_id: number;

  @Column({ type: 'int', nullable: true })
  rate_type_id: number | null;

  @Column({ type: 'int', nullable: true })
  rate_period_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => RateSeasonEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rate_season_id' })
  rateSeason: RateSeasonEntity;

  @ManyToOne(() => RateTypeEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rate_type_id' })
  rateType: RateTypeEntity | null;

  @ManyToOne(() => RatePeriodEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rate_period_id' })
  ratePeriod: RatePeriodEntity | null;

  @OneToMany(() => RateItemTimingEntity, (timing) => timing.rateItem)
  timings: RateItemTimingEntity[];

  @OneToMany(() => RateItemBlockEntity, (block) => block.rateItem)
  blocks: RateItemBlockEntity[];

  @OneToMany(() => RateItemDemandEntity, (demand) => demand.rateItem)
  demands: RateItemDemandEntity[];
}
