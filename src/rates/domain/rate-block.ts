export class RateBlock {
  rateBlockId: number;
  planId: number;
  rateBlockName: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  ratePerKwh: number;
  supplyChargePerDay: number;
  rateType: string;
  season: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
