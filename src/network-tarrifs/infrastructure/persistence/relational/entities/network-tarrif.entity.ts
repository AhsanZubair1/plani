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
import { ntcRelnEntity } from './ntc-reln.entity';
import { distributorEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/distributor.entity';

@Entity({
  name: TABLES.networkTariff,
})
export class networkTariffEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  network_tariff_id: number;

  @Column({ type: 'varchar', length: 50 })
  network_tariff_code: string;

  @Column({ type: 'boolean', default: false })
  usage: boolean;

  @Column({ type: 'boolean', default: false })
  demand: boolean;

  @Column({ type: 'boolean', default: false })
  controlled_load: boolean;

  @Column({ type: 'boolean', default: false })
  solar: boolean;

  @ManyToOne(
    () => distributorEntity,
    (distributor) => distributor.networkTariffs,
  )
  @JoinColumn({ name: 'distributor_id' })
  distributor: distributorEntity;

  @Column({ type: 'int' })
  distributor_id: number;

  @OneToMany(() => ntcRelnEntity, (ntcReln) => ntcReln.network_tariff)
  ntcRelations: ntcRelnEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
