import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CampaignStatusEntity } from './campaign-status.entity';
import { CampaignChannelRelnEntity } from './campaign-channel-reln.entity';
import { CampaignPlanRelnEntity } from './campaign-plan-reln.entity';

@Entity({ name: 'campaign' })
export class CampaignEntity {
  @PrimaryGeneratedColumn('increment')
  campaign_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  campaign_code: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  campaign_name: string;

  @Column({ type: 'text', nullable: true })
  campaign_desc: string | null;

  @Column({ type: 'date', nullable: false })
  effective_from: Date;

  @Column({ type: 'date', nullable: true })
  effective_to: Date | null;

  @Column({ type: 'int', nullable: false })
  campaign_status_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => CampaignStatusEntity, (status) => status.campaigns, {
    nullable: false,
  })
  @JoinColumn({ name: 'campaign_status_id' })
  campaignStatus: CampaignStatusEntity;

  @OneToMany(() => CampaignChannelRelnEntity, (reln) => reln.campaign)
  campaignChannelRelns: CampaignChannelRelnEntity[];

  @OneToMany(() => CampaignPlanRelnEntity, (reln) => reln.campaign)
  campaignPlanRelns: CampaignPlanRelnEntity[];
}
