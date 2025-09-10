import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, // Add this import
} from 'typeorm';

import { RateClassEntity } from './rate-class.entity';
import { RateItemEntity } from './rate-item.entity'; // Add this import

@Entity({ name: 'rate_types' })
export class RateTypeEntity {
  @PrimaryGeneratedColumn('increment')
  rate_type_id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rate_type_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  rate_type_name: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  has_timings: boolean;

  @Column({ type: 'int', nullable: true })
  rate_class_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => RateClassEntity)
  @JoinColumn({ name: 'rate_class_id' })
  rateClass: RateClassEntity | null;

  @OneToMany(() => RateItemEntity, (rateItem) => rateItem.rateType)
  rateItems: RateItemEntity[];
}
