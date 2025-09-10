import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RateItemEntity } from './rate-item.entity';

@Entity({ name: 'rate_item_blocks' })
export class RateItemBlockEntity {
  @PrimaryGeneratedColumn()
  rate_item_block_id: number;

  @Column({ type: 'int' })
  block_number: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  block_consumption: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  block_rate: number;

  @Column({ type: 'int' })
  rate_item_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => RateItemEntity, (rateItem) => rateItem.blocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rate_item_id' })
  rateItem: RateItemEntity;
}
