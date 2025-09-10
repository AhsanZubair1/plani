export class RateItem {
  rateItemId: number;
  rateItemName: string;
  rateItemDetails?: string | null;
  rateSeasonId: number;
  rateTypeId: number;
  ratePeriodId: number;
  createdAt: Date;
  updatedAt: Date;

  // Related data
  timings?: RateItemTiming[];
  blocks?: RateItemBlock[];
  demands?: RateItemDemand[];
}

export class RateItemTiming {
  rateItemTimingId: number;
  timeBandStart: string;
  timeBandEnd: string;
  weekdays: boolean;
  weekendSat: boolean;
  weekendSun: boolean;
  rateItemId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class RateItemBlock {
  rateItemBlockId: number;
  blockNumber: number;
  blockConsumption: number;
  blockRate: number;
  rateItemId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class RateItemDemand {
  rateItemDemandId: number;
  minKw: number;
  maxKw: number;
  charge: number;
  rateItemId: number;
  measurementPeriodId: number;
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
