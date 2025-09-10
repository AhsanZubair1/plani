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
  @PrimaryGeneratedColumn('increment')
  charge_category_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  charge_category_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  charge_category_name: string;

  @Column({ type: 'int', nullable: true })
  charge_class_id: number | null;

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
  chargeClass: ChargeClassEntity | null;

  @OneToMany(() => ChargeEntity, (charge) => charge.chargeCategory)
  charges: ChargeEntity[];
}
