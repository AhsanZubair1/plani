import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChargeTermNameEntity } from './charge-term-name.entity';

import { ChargeEntity } from './charge.entity';

@Entity({ name: 'charge_terms' })
export class ChargeTermEntity {
  @PrimaryGeneratedColumn('increment')
  charge_term_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  charge_term_code: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => ChargeEntity, (charge) => charge.chargeTerm)
  charges: ChargeEntity[];

  @OneToMany(
    () => ChargeTermNameEntity,
    (chargeTermName) => chargeTermName.chargeTerm,
  )
  chargeTermNames: ChargeTermNameEntity[];
}
