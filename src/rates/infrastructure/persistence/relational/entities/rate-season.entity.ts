import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RateEntity } from './rate.entity';

@Entity({ name: 'rate_seasons' })
export class RateSeasonEntity {
  @PrimaryGeneratedColumn()
  rate_season_id: number;

  @Column({ type: 'varchar', length: 20 })
  season_code: string;

  @Column({ type: 'varchar', length: 100 })
  season_name: string;

  @Column({ type: 'date' })
  effective_from: Date;

  @Column({ type: 'date' })
  effective_to: Date;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  daily_charge: number;

  @Column({ type: 'int' })
  rate_id: number;

  @ManyToOne(() => RateEntity)
  @JoinColumn({ name: 'rate_id' })
  rate: RateEntity;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
