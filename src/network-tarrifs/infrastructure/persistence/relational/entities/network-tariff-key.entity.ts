import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { TABLES } from '@src/common/constants';
import { ntcRelnEntity } from '@src/network-tarrifs/infrastructure/persistence/relational/entities/ntc-reln.entity';
import { retailNtcKeyRelnEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/retail-ntc-key-reln.entity';

@Entity({ name: TABLES.networkTariffKey })
export class networkTariffKeyEntity {
  @PrimaryGeneratedColumn('increment')
  network_tariff_key_id: number;

  @Column({ type: 'varchar', length: 50 })
  network_tariff_key_code: string;

  @OneToMany(
    () => retailNtcKeyRelnEntity,
    (retailNtcKeyReln) => retailNtcKeyReln.network_tariff_key,
  )
  retailNtcKeyRelations: retailNtcKeyRelnEntity[];

  @OneToMany(() => ntcRelnEntity, (ntcReln) => ntcReln.network_tariff_key)
  ntcRelations: ntcRelnEntity[];
}
