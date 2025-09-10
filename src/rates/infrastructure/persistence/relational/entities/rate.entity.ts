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
  @PrimaryGeneratedColumn('increment')
  rate_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rate_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  rate_name: string;

  @Column({ type: 'int', nullable: false })
  rate_category_id: number;

  @Column({ type: 'int', nullable: false })
  rate_card_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => RateCategoryEntity)
  @JoinColumn({ name: 'rate_category_id' })
  rateCategory: RateCategoryEntity;

  @ManyToOne(() => RateCardEntity)
  @JoinColumn({ name: 'rate_card_id' })
  rateCard: RateCardEntity;
}
