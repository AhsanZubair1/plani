import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampaignEntity } from './infrastructure/persistence/relational/entities/campaign.entity';
import { CampaignStatusEntity } from './infrastructure/persistence/relational/entities/campaign-status.entity';
import { ChannelEntity } from './infrastructure/persistence/relational/entities/channel.entity';
import { CampaignChannelRelnEntity } from './infrastructure/persistence/relational/entities/campaign-channel-reln.entity';
import { CampaignPlanRelnEntity } from './infrastructure/persistence/relational/entities/campaign-plan-reln.entity';

import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
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
    ]),
  ],
  controllers: [CampaignsController],
  providers: [
    {
      provide: CampaignAbstractRepository,
      useClass: CampaignRelationalRepository,
    },
    CampaignsService,
  ],
  exports: [CampaignsService, CampaignAbstractRepository],
})
export class CampaignsModule {}
