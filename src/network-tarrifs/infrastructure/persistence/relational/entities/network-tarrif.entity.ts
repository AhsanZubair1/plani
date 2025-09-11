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
import { distributorEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/distributor.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

import { ntcRelnEntity } from './ntc-reln.entity';

@Entity({
  name: TABLES.networkTariff,
})
export class networkTariffEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  network_tariff_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  network_tariff_code: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  usage: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  demand: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  controlled_load: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  solar: boolean;

  @Column({ type: 'int', nullable: true })
  distributor_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => distributorEntity,
    (distributor) => distributor.networkTariffs,
  )
  @JoinColumn({ name: 'distributor_id' })
  distributor: distributorEntity | null;

  @OneToMany(() => ntcRelnEntity, (ntcReln) => ntcReln.network_tariff)
  ntcRelations: ntcRelnEntity[];
}
