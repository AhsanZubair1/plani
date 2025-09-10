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
import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';
import { retailNtcKeyRelnEntity } from '@src/retail-tariffs/infrastructure/persistence/relational/entities/retail-ntc-key-reln.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { customerTypeEntity } from './customer-type.entity';
import { distributorEntity } from './distributor.entity';

@Entity({
  name: TABLES.retailTariff,
})
export class retailTariffsEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  retail_tariff_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  retail_tariff_code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  retail_tariff_name: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  sacl_flag: boolean;

  @Column({ type: 'boolean', default: true, nullable: false })
  active: boolean;

  @Column({ type: 'int', nullable: true })
  distributor_id: number | null;

  @Column({ type: 'int', nullable: true })
  customer_type_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => distributorEntity,
    (distributor) => distributor.retailTariffs,
  )
  @JoinColumn({ name: 'distributor_id' })
  distributor: distributorEntity | null;

  @ManyToOne(
    () => customerTypeEntity,
    (customerType) => customerType.retailTariffs,
  )
  @JoinColumn({ name: 'customer_type_id' })
  customer_type: customerTypeEntity | null;

  @OneToMany(
    () => retailNtcKeyRelnEntity,
    (retailNtcKeyReln) => retailNtcKeyReln.retail_tariff,
  )
  retailNtcKeyRelations: retailNtcKeyRelnEntity[];

  @OneToMany(() => PlanEntity, (plan) => plan.retailTariff)
  plans: PlanEntity[];
}
