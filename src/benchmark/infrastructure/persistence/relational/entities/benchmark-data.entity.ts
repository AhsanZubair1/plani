import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'benchmark_data' })
export class BenchmarkDataEntity {
  @PrimaryGeneratedColumn('increment')
  benchmark_data_id: number;

  @Column({ type: 'int', nullable: false })
  year: number;

  @Column({ type: 'decimal', precision: 12, scale: 0, nullable: false })
  usage: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  customer_type_id: number;

  @Column({ type: 'int', nullable: false })
  distributor_id: number;

  @Column({ type: 'int', nullable: false })
  tariff_type_id: number;
}
