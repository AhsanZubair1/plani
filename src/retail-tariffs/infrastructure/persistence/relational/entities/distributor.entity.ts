import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { stateEntity } from './state.entity';
import { retailTariffsEntity } from './retail-tariffs.entity';
import { TABLES } from '@src/common/constants';
import { networkTariffEntity } from '@src/network-tarrifs/infrastructure/persistence/relational/entities/network-tarrif.entity';

@Entity({ name: TABLES.distributor })
export class distributorEntity {
  @PrimaryGeneratedColumn('increment')
  distributor_id: number;

  @Column({ type: 'varchar', length: 50 })
  distributor_code: string;

  @Column({ type: 'varchar', length: 255 })
  distributor_name: string;

  @Column({ type: 'varchar', length: 10 })
  mirn_prefix: string;

  @ManyToOne(() => stateEntity, (state) => state.distributors)
  @JoinColumn({ name: 'state_id' })
  state: stateEntity;

  @Column({ type: 'int' })
  state_id: number;

  @OneToMany(
    () => retailTariffsEntity,
    (retailTariff) => retailTariff.distributor,
  )
  retailTariffs: retailTariffsEntity[];

  @OneToMany(
    () => networkTariffEntity,
    (networkTariffs) => networkTariffs.distributor,
  )
  networkTariffs: networkTariffEntity[];
}
