import { Injectable } from '@nestjs/common';

import { Campaign } from './domain/campaign';
import { CampaignAbstractRepository } from './infrastructure/persistence/campaign.abstract.repository';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsRepository: CampaignAbstractRepository,
  ) {}

  async findAll(): Promise<Campaign[]> {
    return this.campaignsRepository.findAll();
  }

  async findById(id: number): Promise<Campaign | null> {
    return this.campaignsRepository.findById(id);
  }

  async findByPlanId(planId: number): Promise<Campaign[]> {
    return this.campaignsRepository.findByPlanId(planId);
  }

  async getCampaignsByStatus(statusCode: string): Promise<Campaign[]> {
    return this.campaignsRepository.findByStatus(statusCode);
  }

  // Simple Channel API
  async getChannelsWithCampaigns(): Promise<any> {
    return this.campaignsRepository.getChannelsWithCampaigns();
  }

  async getChannelTimeBasedStats(
    channelId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    return this.campaignsRepository.getChannelTimeBasedStats(
      channelId,
      startDate,
      endDate,
    );
  }
}
