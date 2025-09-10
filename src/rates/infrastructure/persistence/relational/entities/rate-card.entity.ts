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

import { TariffTypeEntity } from './tariff-type.entity';
import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';
import { RateEntity } from '@src/rates/infrastructure/persistence/relational/entities/rate.entity';

@Entity({ name: 'rate_cards' })
export class RateCardEntity {
  @PrimaryGeneratedColumn('increment')
  rate_card_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  rate_card_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  underlying_nt_type: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  time_definition: string | null;

  @Column({ type: 'int', nullable: true })
  tariff_type_id: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => TariffTypeEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'tariff_type_id' })
  tariffType: TariffTypeEntity | null;

  @OneToMany(() => PlanEntity, (plan) => plan.rateCard)
  plans: PlanEntity[];

  @OneToMany(() => RateEntity, (rate) => rate.rateCard)
  rates: RateEntity[];
}
