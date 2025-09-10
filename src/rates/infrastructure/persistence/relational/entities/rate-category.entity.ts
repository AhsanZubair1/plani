import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { RateEntity } from './rate.entity';

@Entity({ name: 'rate_categories' })
export class RateCategoryEntity {
  @PrimaryGeneratedColumn('increment')
  rate_category_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rate_category_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  rate_category_name: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  allow_multi_seasons: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToOne(() => RateEntity, (rate) => rate.rateCategory)
  rate: RateEntity;
}
