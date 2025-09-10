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
    unique: true,
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

  @Column({
    type: 'text',
    nullable: true,
    name: 'included_postcodes',
  })
  included_postcodes: string | null;

  @Column({
    type: 'text',
    nullable: true,
    name: 'excluded_postcodes',
  })
  excluded_postcodes: string | null;

  @OneToMany(() => PlanEntity, (plan) => plan.zone)
  plans: PlanEntity[];
}
