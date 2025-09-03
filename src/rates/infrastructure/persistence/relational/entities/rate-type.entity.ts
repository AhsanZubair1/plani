import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RateClassEntity } from './rate-class.entity';

@Entity({ name: 'rate_types' })
export class RateTypeEntity {
  @PrimaryGeneratedColumn()
  rate_type_id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  rate_type_code: string;

  @Column({ type: 'varchar', length: 100 })
  rate_type_name: string;

  @Column({ type: 'boolean', default: false })
  has_timings: boolean;

  @Column({ type: 'int' })
  rate_class_id: number;

  @ManyToOne(() => RateClassEntity)
  @JoinColumn({ name: 'rate_class_id' })
  rateClass: RateClassEntity;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
