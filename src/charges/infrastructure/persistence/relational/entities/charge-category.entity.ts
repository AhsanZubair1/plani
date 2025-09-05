import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChargeClassEntity } from './charge-class.entity';
import { ChargeEntity } from './charge.entity';

@Entity({ name: 'charge_categories' })
export class ChargeCategoryEntity {
  @PrimaryGeneratedColumn()
  charge_category_id: number;

  @Column({ type: 'varchar', length: 50 })
  charge_category_code: string;

  @Column({ type: 'varchar', length: 100 })
  charge_category_name: string;

  @Column({ type: 'int' })
  charge_class_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => ChargeClassEntity,
    (chargeClass) => chargeClass.chargeCategories,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'charge_class_id' })
  chargeClass: ChargeClassEntity;

  @OneToMany(() => ChargeEntity, (charge) => charge.chargeCategory)
  charges: ChargeEntity[];
}
