export class RateItem {
  rateItemId: number;
  rateItemName: string;
  rateItemDetails?: string | null;
  rateSeasonId: number;
  rateTypeId: number | null;
  ratePeriodId: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Related data
  timings?: RateItemTiming[];
  blocks?: RateItemBlock[];
  demand?: RateItemDemand | null;
}

export class RateItemTiming {
  rateItemTimingId: number;
  timeBandStart: string;
  timeBandEnd: string;
  weekdays: boolean | null;
  weekendSat: boolean | null;
  weekendSun: boolean | null;
  rateItemId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class RateItemBlock {
  rateItemBlockId: number;
  blockNumber: number;
  blockConsumption: number | null;
  blockRate: number;
  rateItemId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class RateItemDemand {
  rateItemDemandId: number;
  minKw: number;
  maxKw: number | null;
  charge: number;
  rateItemId: number | null;
  measurementPeriodId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class RatePeriod {
  ratePeriodId: number;
  ratePeriodCode: string;
  ratePeriodName: string;
  createdAt: Date;
  updatedAt: Date;
}
