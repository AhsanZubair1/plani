import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { networkTariffEntity } from './network-tarrif.entity';
import { networkTariffKeyEntity } from './network-tariff-key.entity';
import { TABLES } from '@src/common/constants';

@Entity({ name: TABLES.ntcReln })
export class ntcRelnEntity {
  @PrimaryGeneratedColumn('increment')
  ntc_reln_id: number;

  @ManyToOne(
    () => networkTariffEntity,
    (networkTariff) => networkTariff.ntcRelations,
  )
  @JoinColumn({ name: 'network_tariff_id' })
  network_tariff: networkTariffEntity;

  @Column({ type: 'int' })
  network_tariff_id: number;

  @ManyToOne(
    () => networkTariffKeyEntity,
    (networkTariffKey) => networkTariffKey.ntcRelations,
  )
  @JoinColumn({ name: 'network_tariff_key_id' })
  network_tariff_key: networkTariffKeyEntity;

  @Column({ type: 'int' })
  network_tariff_key_id: number;
}
