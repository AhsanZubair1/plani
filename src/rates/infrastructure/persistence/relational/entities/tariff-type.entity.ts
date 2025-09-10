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
  @PrimaryGeneratedColumn('increment')
  tariff_type_id: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  tariff_type_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  tariff_type_name: string;

  @Column({ type: 'int', nullable: true })
  fuel_type_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // EXTRA
  @Column({ type: 'varchar', length: 100 })
  time_definition: string;
  //

  @ManyToOne(() => FuelTypeEntity)
  @JoinColumn({ name: 'fuel_type_id' })
  fuelType: FuelTypeEntity | null;

  @OneToMany(() => RateCardEntity, (rateCard) => rateCard.tariffType)
  rateCards: RateCardEntity[];
}
