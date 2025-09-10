import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RateCardEntity } from './rate-card.entity';
import { RateCategoryEntity } from './rate-category.entity';
import { RateSeasonEntity } from './rate-season.entity';

@Entity({ name: 'rates' })
export class RateEntity {
  @PrimaryGeneratedColumn('increment')
  rate_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rate_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  rate_name: string;

  @Column({ type: 'int', nullable: false, unique: true })
  rate_category_id: number;

  @Column({ type: 'int', nullable: false })
  rate_card_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToOne(() => RateCategoryEntity, (rateCategory) => rateCategory.rate, {
    nullable: false,
  })
  @JoinColumn({ name: 'rate_category_id' })
  rateCategory: RateCategoryEntity;

  @ManyToOne(() => RateCardEntity)
  @JoinColumn({ name: 'rate_card_id' })
  rateCard: RateCardEntity;

  @OneToMany(() => RateSeasonEntity, (rateSeason) => rateSeason.rate)
  rateSeasons: RateSeasonEntity[];
}
