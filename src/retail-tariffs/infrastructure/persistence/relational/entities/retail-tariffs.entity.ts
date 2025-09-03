import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { distributorEntity } from './distributor.entity';
import { customerTypeEntity } from './customer-type.entity';
import { retailNtcKeyRelnEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/retail-ntc-key-reln.entity';

@Entity({
  name: TABLES.retailTariff,
})
export class retailTariffsEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  retail_tariff_id: number;

  @Column({ type: 'varchar', length: 50 })
  retail_tariff_code: string;

  @Column({ type: 'varchar', length: 255 })
  retail_tariff_name: string;

  @Column({ type: 'boolean', default: false })
  sacl_flag: boolean;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ManyToOne(
    () => distributorEntity,
    (distributor) => distributor.retailTariffs,
  )
  @JoinColumn({ name: 'distributor_id' })
  distributor: distributorEntity;

  @Column({ type: 'int' })
  distributor_id: number;

  @ManyToOne(
    () => customerTypeEntity,
    (customerType) => customerType.retailTariffs,
  )
  @JoinColumn({ name: 'customer_type_id' })
  customer_type: customerTypeEntity;

  @Column({ type: 'int' })
  customer_type_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => retailNtcKeyRelnEntity,
    (retailNtcKeyReln) => retailNtcKeyReln.retail_tariff,
  )
  retailNtcKeyRelations: retailNtcKeyRelnEntity[];
}
