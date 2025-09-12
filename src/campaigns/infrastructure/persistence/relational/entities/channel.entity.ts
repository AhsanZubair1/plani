import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CampaignChannelRelnEntity } from './campaign-channel-reln.entity';

@Entity({ name: 'channel' })
export class ChannelEntity {
  @PrimaryGeneratedColumn('increment')
  channel_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  channel_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  channel_name: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => CampaignChannelRelnEntity, (reln) => reln.channel)
  campaignChannelRelns: CampaignChannelRelnEntity[];
}
