import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TariffTypeEntity } from './tariff-type.entity';

@Entity({ name: 'rate_cards' })
export class RateCardEntity {
  @PrimaryGeneratedColumn('increment')
  rate_card_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  rate_card_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  underlying_nt_type: string | null;

  // ADDED-NEW
  @Column({ type: 'varchar', length: 50, nullable: true })
  time_definition: string | null;

  @Column({ type: 'int', nullable: true })
  tariff_type_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => TariffTypeEntity, { eager: true })
  @JoinColumn({ name: 'tariff_type_id' })
  tariffType: TariffTypeEntity | null;
}
