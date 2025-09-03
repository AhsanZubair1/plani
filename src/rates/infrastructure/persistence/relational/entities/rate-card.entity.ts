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
  @PrimaryGeneratedColumn()
  rate_card_id: number;

  @Column({ type: 'varchar', length: 255 })
  rate_card_name: string;

  @Column({ type: 'varchar', length: 50 })
  underlying_nt_type: string;

  @Column({ type: 'int' })
  tariff_type_id: number;

  @ManyToOne(() => TariffTypeEntity)
  @JoinColumn({ name: 'tariff_type_id' })
  tariffType: TariffTypeEntity;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
