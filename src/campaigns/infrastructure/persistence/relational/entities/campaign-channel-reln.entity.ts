import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CampaignEntity } from './campaign.entity';
import { ChannelEntity } from './channel.entity';

@Entity({ name: 'campaign_channel_reln' })
export class CampaignChannelRelnEntity {
  @PrimaryGeneratedColumn('increment')
  campaign_channel_reln_id: number;

  @Column({ type: 'int', nullable: false })
  campaign_id: number;

  @Column({ type: 'int', nullable: false })
  channel_id: number;

  @Column({ type: 'date', nullable: false })
  effective_from: Date;

  @Column({ type: 'date', nullable: true })
  effective_to: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => CampaignEntity,
    (campaign) => campaign.campaignChannelRelns,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'campaign_id' })
  campaign: CampaignEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.campaignChannelRelns, {
    nullable: false,
  })
  @JoinColumn({ name: 'channel_id' })
  channel: ChannelEntity;
}
