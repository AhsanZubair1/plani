import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChargeCategoryEntity } from './charge-category.entity';
import { ChargeTermNameEntity } from './charge-term-name.entity';
import { ChargeTypeEntity } from './charge-type.entity';

@Entity({ name: 'charge_classes' })
export class ChargeClassEntity {
  @PrimaryGeneratedColumn('increment')
  charge_class_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  charge_class_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  charge_class_name: string;

  @Column({ type: 'int', default: 0, nullable: false })
  multiplier: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => ChargeTypeEntity, (chargeType) => chargeType.chargeClass)
  chargeTypes: ChargeTypeEntity[];

  @OneToMany(
    () => ChargeCategoryEntity,
    (chargeCategory) => chargeCategory.chargeClass,
  )
  chargeCategories: ChargeCategoryEntity[];

  @OneToMany(
    () => ChargeTermNameEntity,
    (chargeTermName) => chargeTermName.chargeClass,
  )
  chargeTermNames: ChargeTermNameEntity[];
}
