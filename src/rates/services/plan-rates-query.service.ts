import { Injectable } from '@nestjs/common';

import {
  RateItem,
  RateItemTiming,
  RateItemBlock,
  RateItemDemand,
} from '@src/rates/domain/rate-item';
import { RatesAbstractRepository } from '@src/rates/infrastructure/persistence/rates.abstract.repository';
import { RateItemMapper } from '@src/rates/infrastructure/persistence/relational/mappers/rate-item.mapper';

export interface PlanRatesQueryOptions {
  planId: number;
  season?: string;
  rateType?: string;
  timeRange?: {
    startTime: string;
    endTime: string;
  };
  dayOfWeek?: 'weekdays' | 'weekend_sat' | 'weekend_sun';
}

export interface PlanRatesResult {
  planId: number;
  rateItems: RateItem[];
  timeBasedRates: TimeBasedRateStructure[];
  usageBlocks: UsageBlockStructure[];
  demandCharges: DemandChargeStructure[];
}

export interface TimeBasedRateStructure {
  rateItemId: number;
  rateItemName: string;
  season: string;
  rateType: string;
  timeBand: {
    start: string;
    end: string;
  };
  applicableDays: string[];
  blocks: UsageBlockStructure[];
}

export interface UsageBlockStructure {
  rateItemId: number;
  blockNumber: number;
  consumptionRange: {
    min: number;
    max: number;
  };
  rate: number;
  timeBand?: {
    start: string;
    end: string;
  };
  applicableDays?: string[];
}

export interface DemandChargeStructure {
  rateItemId: number;
  demandRange: {
    minKw: number;
    maxKw: number;
  };
  charge: number;
  measurementPeriod: string;
}

@Injectable()
export class PlanRatesQueryService {
  constructor(private readonly ratesRepository: RatesAbstractRepository) {}

  async getPlanRates(options: PlanRatesQueryOptions): Promise<PlanRatesResult> {
    const { planId, season, rateType, timeRange, dayOfWeek } = options;

    // Get rate blocks and timings for the plan
    const rateBlocks =
      await this.ratesRepository.findRateBlocksByPlanId(planId);
    const rateTimings =
      await this.ratesRepository.findRateTimingsByPlanId(planId);

    // Apply filters
    let filteredRateBlocks = rateBlocks;
    let filteredRateTimings = rateTimings;

    if (season) {
      filteredRateBlocks = rateBlocks.filter(
        (block) => block.season === season,
      );
      filteredRateTimings = rateTimings.filter(
        (timing) => timing.season === season,
      );
    }

    if (rateType) {
      filteredRateBlocks = filteredRateBlocks.filter(
        (block) => block.rateType === rateType,
      );
    }

    if (timeRange) {
      filteredRateBlocks = filteredRateBlocks.filter(
        (block) =>
          block.startTime <= timeRange.endTime &&
          block.endTime >= timeRange.startTime,
      );
      filteredRateTimings = filteredRateTimings.filter(
        (timing) =>
          timing.startTime <= timeRange.endTime &&
          timing.endTime >= timeRange.startTime,
      );
    }

    if (dayOfWeek) {
      const dayMap = {
        weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        weekend_sat: ['SATURDAY'],
        weekend_sun: ['SUNDAY'],
      };
      const targetDays = dayMap[dayOfWeek] || [];

      filteredRateBlocks = filteredRateBlocks.filter((block) =>
        block.daysOfWeek.some((day) => targetDays.includes(day)),
      );
      filteredRateTimings = filteredRateTimings.filter((timing) =>
        timing.daysOfWeek.some((day) => targetDays.includes(day)),
      );
    }

    // Build time-based rate structures
    const timeBasedRates = this.buildTimeBasedRatesFromBlocks(
      filteredRateBlocks,
      filteredRateTimings,
    );

    // Build usage block structures
    const usageBlocks = this.buildUsageBlocksFromBlocks(filteredRateBlocks);

    // Build demand charge structures (empty for now as we don't have demand data)
    const demandCharges: DemandChargeStructure[] = [];

    return {
      planId,
      rateItems: [], // Empty for now as we're using rate blocks
      timeBasedRates,
      usageBlocks,
      demandCharges,
    };
  }

  private buildTimeBasedRatesFromBlocks(
    rateBlocks: any[],
    rateTimings: any[],
  ): TimeBasedRateStructure[] {
    const timeBasedRates: TimeBasedRateStructure[] = [];

    rateBlocks.forEach((block) => {
      const timeBasedRate: TimeBasedRateStructure = {
        rateItemId: block.rateBlockId,
        rateItemName: block.rateBlockName,
        season: block.season,
        rateType: block.rateType,
        timeBand: {
          start: block.startTime,
          end: block.endTime,
        },
        applicableDays: block.daysOfWeek,
        blocks: [
          {
            rateItemId: block.rateBlockId,
            blockNumber: 1,
            consumptionRange: {
              min: 0,
              max: Infinity,
            },
            rate: block.ratePerKwh,
            timeBand: {
              start: block.startTime,
              end: block.endTime,
            },
            applicableDays: block.daysOfWeek,
          },
        ],
      };

      timeBasedRates.push(timeBasedRate);
    });

    return timeBasedRates;
  }

  private buildUsageBlocksFromBlocks(rateBlocks: any[]): UsageBlockStructure[] {
    const usageBlocks: UsageBlockStructure[] = [];

    rateBlocks.forEach((block) => {
      const usageBlock: UsageBlockStructure = {
        rateItemId: block.rateBlockId,
        blockNumber: 1,
        consumptionRange: {
          min: 0,
          max: Infinity,
        },
        rate: block.ratePerKwh,
        timeBand: {
          start: block.startTime,
          end: block.endTime,
        },
        applicableDays: block.daysOfWeek,
      };

      usageBlocks.push(usageBlock);
    });

    return usageBlocks;
  }

  // Helper method to get rates by specific time and day
  async getRatesByTimeAndDay(
    planId: number,
    time: string,
    dayOfWeek: 'weekdays' | 'weekend_sat' | 'weekend_sun',
    season?: string,
  ): Promise<PlanRatesResult> {
    return this.getPlanRates({
      planId,
      season,
      timeRange: { startTime: time, endTime: time },
      dayOfWeek,
    });
  }

  // Helper method to get all rates for a plan
  async getAllPlanRates(planId: number): Promise<PlanRatesResult> {
    return this.getPlanRates({ planId });
  }
}
