import { Campaign } from '@src/campaigns/domain/campaign';

export abstract class CampaignAbstractRepository {
  abstract findAll(): Promise<Campaign[]>;
  abstract findById(id: number): Promise<Campaign | null>;
  abstract findByPlanId(planId: number): Promise<Campaign[]>;
  abstract findByStatus(statusCode: string): Promise<Campaign[]>;
}
