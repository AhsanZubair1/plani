import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { TABLES } from '@src/common/constants';

import { distributorEntity } from './distributor.entity';
@Entity({ name: TABLES.state })
export class stateEntity {
  @PrimaryGeneratedColumn('increment')
  state_id: number;

  @Column({ type: 'varchar', length: 10 })
  state_code: string;

  @Column({ type: 'varchar', length: 100 })
  state_name: string;

  @OneToMany(() => distributorEntity, (distributor) => distributor.state)
  distributors: distributorEntity[];
}
