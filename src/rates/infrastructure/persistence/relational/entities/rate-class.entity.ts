import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'rate_classes' })
export class RateClassEntity {
  @PrimaryGeneratedColumn()
  rate_class_id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  rate_class_code: string;

  @Column({ type: 'varchar', length: 100 })
  rate_class_name: string;

  @Column({ type: 'boolean', default: false })
  validate_24_hour_timing: boolean;

  @Column({ type: 'int', default: 1 })
  multiplier: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
