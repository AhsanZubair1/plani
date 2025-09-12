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
import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

@Entity({ name: 'campaign_plan_reln' })
export class CampaignPlanRelnEntity {
  @PrimaryGeneratedColumn('increment')
  campaign_plan_id: number;

  @Column({ type: 'int', nullable: false })
  campaign_id: number;

  @Column({ type: 'int', nullable: false })
  plan_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => CampaignEntity, (campaign) => campaign.campaignPlanRelns, {
    nullable: false,
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign: CampaignEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.campaignPlanRelns, {
    nullable: false,
  })
  @JoinColumn({ name: 'plan_id' })
  plan: PlanEntity;
}
