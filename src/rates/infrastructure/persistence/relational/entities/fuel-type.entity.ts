import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TariffTypeEntity } from './tariff-type.entity';

@Entity({ name: 'fuel_types' })
export class FuelTypeEntity {
  @PrimaryGeneratedColumn('increment')
  fuel_type_id: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  fuel_type_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fuel_type_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => TariffTypeEntity, (tariffType) => tariffType.fuelType)
  tariffTypes: TariffTypeEntity[];
}
