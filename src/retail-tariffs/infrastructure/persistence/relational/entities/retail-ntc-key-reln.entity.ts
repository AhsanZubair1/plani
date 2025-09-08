import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { networkTariffKeyEntity } from '@src/network-tarrifs/infrastructure/persistence/relational/entities/network-tariff-key.entity';

import { retailTariffsEntity } from './retail-tariffs.entity';

@Entity({ name: TABLES.retailNtcKeyReln })
export class retailNtcKeyRelnEntity {
  @PrimaryGeneratedColumn('increment')
  retail_ntc_reln_id: number;

  @ManyToOne(
    () => retailTariffsEntity,
    (retailTariff) => retailTariff.retailNtcKeyRelations,
  )
  @JoinColumn({ name: 'retail_tariff_id' })
  retail_tariff: retailTariffsEntity;

  @Column({ type: 'int' })
  retail_tariff_id: number;

  @ManyToOne(
    () => networkTariffKeyEntity,
    (networkTariffKey) => networkTariffKey.retailNtcKeyRelations,
  )
  @JoinColumn({ name: 'network_tariff_key_id' })
  network_tariff_key: networkTariffKeyEntity;

  @Column({ type: 'int' })
  network_tariff_key_id: number;
}
