import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'rate_categories' })
export class RateCategoryEntity {
  @PrimaryGeneratedColumn()
  rate_category_id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  rate_category_code: string;

  @Column({ type: 'varchar', length: 100 })
  rate_category_name: string;

  @Column({ type: 'boolean', default: false })
  allow_multi_seasons: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
