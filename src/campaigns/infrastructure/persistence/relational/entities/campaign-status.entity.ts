import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CampaignEntity } from './campaign.entity';

@Entity({ name: 'campaign_status' })
export class CampaignStatusEntity {
  @PrimaryGeneratedColumn('increment')
  campaign_status_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  campaign_status_code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  campaign_status_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => CampaignEntity, (campaign) => campaign.campaignStatus)
  campaigns: CampaignEntity[];
}
