import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RateCardEntity } from './rate-card.entity';
import { RateCategoryEntity } from './rate-category.entity';

@Entity({ name: 'rates' })
export class RateEntity {
  @PrimaryGeneratedColumn()
  rate_id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  rate_code: string;

  @Column({ type: 'varchar', length: 100 })
  rate_name: string;

  @Column({ type: 'int' })
  rate_category_id: number;

  @ManyToOne(() => RateCategoryEntity)
  @JoinColumn({ name: 'rate_category_id' })
  rateCategory: RateCategoryEntity;

  @Column({ type: 'int' })
  rate_card_id: number;

  @ManyToOne(() => RateCardEntity)
  @JoinColumn({ name: 'rate_card_id' })
  rateCard: RateCardEntity;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
