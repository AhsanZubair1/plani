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

@Entity({ name: 'charge_types' })
export class ChargeTypeEntity {
  @PrimaryGeneratedColumn()
  charge_type_id: number;

  @Column({ type: 'varchar', length: 50 })
  charge_type_code: string;

  @Column({ type: 'varchar', length: 100 })
  charge_type_name: string;

  @Column({ type: 'int' })
  charge_class_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => ChargeClassEntity,
    (chargeClass) => chargeClass.chargeTypes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'charge_class_id' })
  chargeClass: ChargeClassEntity;

  @OneToMany(() => ChargeEntity, (charge) => charge.chargeType)
  charges: ChargeEntity[];
}
