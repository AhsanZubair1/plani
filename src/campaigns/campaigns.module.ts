import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampaignEntity } from './infrastructure/persistence/relational/entities/campaign.entity';
import { CampaignStatusEntity } from './infrastructure/persistence/relational/entities/campaign-status.entity';
import { ChannelEntity } from './infrastructure/persistence/relational/entities/channel.entity';
import { CampaignChannelRelnEntity } from './infrastructure/persistence/relational/entities/campaign-channel-reln.entity';
import { CampaignPlanRelnEntity } from './infrastructure/persistence/relational/entities/campaign-plan-reln.entity';
import { AuditLogEntity } from '@src/audit/infrastructure/persistence/relational/entities/audit-log.entity';
import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';

import { CampaignsController } from './campaigns.controller';
import { ChannelsController } from './channels.controller';
import { CampaignsService } from './campaigns.service';
import { ChannelAuditService } from './services/channel-audit.service';
import { CampaignAbstractRepository } from './infrastructure/persistence/campaign.abstract.repository';
import { CampaignRelationalRepository } from './infrastructure/persistence/relational/repositories/campaign.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampaignEntity,
      CampaignStatusEntity,
      ChannelEntity,
      CampaignChannelRelnEntity,
      CampaignPlanRelnEntity,
      PlanEntity,
      AuditLogEntity,
    ]),
  ],
  controllers: [CampaignsController, ChannelsController],
  providers: [
    {
      provide: CampaignAbstractRepository,
      useClass: CampaignRelationalRepository,
    },
    CampaignsService,
    ChannelAuditService,
  ],
  exports: [CampaignsService, CampaignAbstractRepository],
})
export class CampaignsModule {}
