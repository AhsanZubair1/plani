import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CampaignAbstractRepository } from '@src/campaigns/infrastructure/persistence/campaign.abstract.repository';
import { CampaignEntity } from '@src/campaigns/infrastructure/persistence/relational/entities/campaign.entity';
import { Campaign } from '@src/campaigns/domain/campaign';

@Injectable()
export class CampaignRelationalRepository extends CampaignAbstractRepository {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepository: Repository<CampaignEntity>,
  ) {
    super();
  }

  async findAll(): Promise<Campaign[]> {
    const campaigns = await this.campaignRepository.find({
      relations: ['campaignStatus'],
    });

    return campaigns.map(this.toDomain);
  }

  async findById(id: number): Promise<Campaign | null> {
    const campaign = await this.campaignRepository.findOne({
      where: { campaign_id: id },
      relations: ['campaignStatus'],
    });

    return campaign ? this.toDomain(campaign) : null;
  }

  async findByPlanId(planId: number): Promise<Campaign[]> {
    const campaigns = await this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.campaignStatus', 'status')
      .leftJoin('campaign.campaignPlanRelns', 'reln')
      .where('reln.plan_id = :planId', { planId })
      .getMany();

    return campaigns.map(this.toDomain);
  }

  async findByStatus(statusCode: string): Promise<Campaign[]> {
    const campaigns = await this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.campaignStatus', 'status')
      .where('status.campaign_status_code = :statusCode', { statusCode })
      .getMany();

    return campaigns.map(this.toDomain);
  }

  private toDomain(campaign: CampaignEntity): Campaign {
    const domain = new Campaign();
    domain.id = campaign.campaign_id;
    domain.campaignCode = campaign.campaign_code;
    domain.campaignName = campaign.campaign_name;
    domain.campaignDesc = campaign.campaign_desc;
    domain.effectiveFrom = campaign.effective_from;
    domain.effectiveTo = campaign.effective_to;
    domain.campaignStatusId = campaign.campaign_status_id;
    domain.createdAt = campaign.created_at;
    domain.updatedAt = campaign.updated_at;

    if (campaign.campaignStatus) {
      domain.campaignStatus = {
        id: campaign.campaignStatus.campaign_status_id,
        campaignStatusCode: campaign.campaignStatus.campaign_status_code,
        campaignStatusName: campaign.campaignStatus.campaign_status_name,
      };
    }

    return domain;
  }
}
