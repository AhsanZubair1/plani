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
  @PrimaryGeneratedColumn('increment')
  charge_type_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  charge_type_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  charge_type_name: string;

  @Column({ type: 'int', nullable: true })
  charge_class_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => ChargeClassEntity,
    (chargeClass) => chargeClass.chargeTypes,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'charge_class_id' })
  chargeClass: ChargeClassEntity | null;

  @OneToMany(() => ChargeEntity, (charge) => charge.chargeType)
  charges: ChargeEntity[];
}
