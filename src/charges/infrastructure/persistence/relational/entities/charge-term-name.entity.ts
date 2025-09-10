import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChargeClassEntity } from './charge-class.entity';
import { ChargeTermEntity } from './charge-term.entity';

@Entity({ name: 'charge_term_names' })
export class ChargeTermNameEntity {
  @PrimaryGeneratedColumn('increment')
  charge_term_name_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  charge_term_name: string;

  @Column({ type: 'int', nullable: false })
  charge_term_id: number;

  @Column({ type: 'int', nullable: false })
  charge_class_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => ChargeTermEntity,
    (chargeTerm) => chargeTerm.chargeTermNames,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'charge_term_id' })
  chargeTerm: ChargeTermEntity;

  @ManyToOne(
    () => ChargeClassEntity,
    (chargeClass) => chargeClass.chargeTermNames,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'charge_class_id' })
  chargeClass: ChargeClassEntity;
}
