import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'retailer' })
export class RetailerEntity {
  @PrimaryGeneratedColumn('increment')
  retailer_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  retailer_code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  retailer_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => PlanEntity, (plan) => plan.retailer)
  plans: PlanEntity[];
}
