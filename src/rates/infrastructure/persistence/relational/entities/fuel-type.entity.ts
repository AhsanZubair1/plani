import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'fuel_types' })
export class FuelTypeEntity {
  @PrimaryGeneratedColumn('increment')
  fuel_type_id: number;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  fuel_type_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fuel_type_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
