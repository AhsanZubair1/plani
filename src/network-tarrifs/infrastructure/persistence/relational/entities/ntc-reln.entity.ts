import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';

import { networkTariffKeyEntity } from './network-tariff-key.entity';
import { networkTariffEntity } from './network-tarrif.entity';

@Entity({ name: TABLES.ntcReln })
export class ntcRelnEntity {
  @PrimaryGeneratedColumn('increment')
  ntc_reln_id: number;

  @Column({ type: 'int', nullable: true })
  network_tariff_id: number | null;

  @Column({ type: 'int' })
  network_tariff_key_id: number;

  @ManyToOne(
    () => networkTariffEntity,
    (networkTariff) => networkTariff.ntcRelations,
  )
  @JoinColumn({ name: 'network_tariff_id' })
  network_tariff: networkTariffEntity | null;

  @ManyToOne(
    () => networkTariffKeyEntity,
    (networkTariffKey) => networkTariffKey.ntcRelations,
  )
  @JoinColumn({ name: 'network_tariff_key_id' })
  network_tariff_key: networkTariffKeyEntity;
}
