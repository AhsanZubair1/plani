import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'zones' })
export class ZoneEntity {
  @PrimaryGeneratedColumn('increment')
  zone_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  zone_code: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  zone_name: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'supply_areas',
  })
  supply_areas: string | null;

  @OneToMany(() => PlanEntity, (plan) => plan.zone)
  plans: PlanEntity[];
}
