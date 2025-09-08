import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'api_logs' })
@Index(['method', 'url'])
@Index(['status_code'])
@Index(['created_at'])
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  method: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  user_id: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  user_agent: string;

  @Column({ type: 'int' })
  status_code: number;

  @Column({ type: 'int' })
  response_time_ms: number;

  @Column({ type: 'text', nullable: true })
  request_body: string | null;

  @Column({ type: 'text', nullable: true })
  response_body: string | null;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  controller: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  action: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
