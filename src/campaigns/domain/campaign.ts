export class Campaign {
  id: number;
  campaignCode: string;
  campaignName: string;
  campaignDesc?: string | null;
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  campaignStatusId: number;
  campaignStatus?: {
    id: number;
    campaignStatusCode: string;
    campaignStatusName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
