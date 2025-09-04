import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { RateCardEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate-card.entity';

import { FuelTypeEntity } from './fuel-type.entity';

@Entity({ name: 'tariff_types' })
export class TariffTypeEntity {
  @PrimaryGeneratedColumn()
  tariff_type_id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  tariff_type_code: string;

  @Column({ type: 'varchar', length: 100 })
  tariff_type_name: string;

  @Column({ type: 'varchar', length: 100 })
  time_definition: string;

  @Column({ type: 'int' })
  fuel_type_id: number;

  @ManyToOne(() => FuelTypeEntity)
  @JoinColumn({ name: 'fuel_type_id' })
  fuelType: FuelTypeEntity;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => RateCardEntity, (rateCard) => rateCard.tariffType)
  rateCards: RateCardEntity[];
}
