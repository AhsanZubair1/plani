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
import { RateEntity } from './rate.entity';
import { RateItemEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-item.entity';

@Entity({ name: 'rate_seasons' })
export class RateSeasonEntity {
  @PrimaryGeneratedColumn('increment')
  rate_season_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  season_code: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  season_name: string | null;

  @Column({ type: 'date', nullable: false })
  effective_from: Date;

  @Column({ type: 'date', nullable: true })
  effective_to: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  daily_charge: number | null;

  @Column({ type: 'int', nullable: false })
  rate_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => RateEntity, (rate) => rate.rateSeasons, {
    nullable: false,
  })
  @JoinColumn({ name: 'rate_id' })
  rate: RateEntity;

  @OneToMany(() => RateItemEntity, (rateItem) => rateItem.rateSeason)
  rateItems: RateItemEntity[];
}
