import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { TABLES } from '@src/common/constants';

import { retailTariffsEntity } from './retail-tariffs.entity';

@Entity({ name: TABLES.customerType })
export class customerTypeEntity {
  @PrimaryGeneratedColumn('increment')
  customer_type_id: number;

  @Column({ type: 'varchar', length: 50 })
  customer_type_code: string;

  @Column({ type: 'varchar', length: 255 })
  customer_type_name: string;

  @OneToMany(
    () => retailTariffsEntity,
    (retailTariff) => retailTariff.customer_type,
  )
  retailTariffs: retailTariffsEntity[];
}
