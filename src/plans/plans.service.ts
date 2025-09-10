import { Injectable } from '@nestjs/common';

import { PlanMapping } from '@src/plans/domain/plan-mapping';
import { PlanRatesQueryService } from '@src/rates/services/plan-rates-query.service';
import { NullableType } from '@src/utils/types/nullable.type';
import { PaginationResponse } from '@src/utils/types/pagination-options';

import { Plan } from './domain/plan';
import { CreatePlanDto } from './dto/create-plan.dto';
import {
  PlanWithRatesDto,
  TimeBasedRate,
  UsageBlock,
} from './dto/plan-with-rates.dto';
import { QueryPlanDto } from './dto/query-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanAbstractRepository } from './infrastructure/persistence/plan.abstract.repository';

@Injectable()
export class PlansService {
  constructor(
    private readonly plansRepository: PlanAbstractRepository,
    private readonly planRatesQueryService: PlanRatesQueryService,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = new Plan();
    Object.assign(plan, createPlanDto);
    plan.effectiveFrom = new Date(createPlanDto.effectiveFrom);
    plan.effectiveTo = new Date(createPlanDto.effectiveTo);
    plan.reviewDate = new Date(createPlanDto.reviewDate);
    plan.restricted = createPlanDto.restricted ?? false;
    plan.contingent = createPlanDto.contingent ?? false;
    plan.directDebitOnly = createPlanDto.directDebitOnly ?? false;
    plan.ebillingOnly = createPlanDto.ebillingOnly ?? false;
    plan.solarCustOnly = createPlanDto.solarCustOnly ?? false;
    plan.evOnly = createPlanDto.evOnly ?? false;
    plan.intrinsicGreen = createPlanDto.instrinctGreen ?? false;

    return this.plansRepository.create(plan);
  }

  async getPlanWithRates(planId: number): Promise<PlanWithRatesDto> {
    // Get the plan with rate blocks and timings
    const plan = await this.plansRepository.findById(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Get comprehensive rate data using the new query service
    const planRatesResult =
      await this.planRatesQueryService.getAllPlanRates(planId);

    // Convert the comprehensive rate structure to the DTO format
    const timeBasedRates: TimeBasedRate[] = planRatesResult.timeBasedRates.map(
      (rate) => ({
        rateType: rate.rateType,
        startTime: rate.timeBand.start,
        endTime: rate.timeBand.end,
        daysOfWeek: rate.applicableDays,
        season: rate.season,
        ratePerKwh: rate.blocks[0]?.rate || plan.defaultRatePerKwh,
        supplyChargePerDay: plan.defaultSupplyChargePerDay,
        usageBlocks: rate.blocks.map((block) => ({
          minUsage: block.consumptionRange.min,
          maxUsage: block.consumptionRange.max,
          ratePerKwh: block.rate,
          description: `${rate.rateType} rate for ${rate.season} season`,
        })),
      }),
    );

    const usageBlocks: UsageBlock[] = planRatesResult.usageBlocks.map(
      (block) => ({
        minUsage: block.consumptionRange.min,
        maxUsage: block.consumptionRange.max,
        ratePerKwh: block.rate,
        description: `Usage block ${block.blockNumber}`,
      }),
    );

    // Calculate peak/off-peak rates summary
    const peakRate =
      timeBasedRates.find((r) => r.rateType === 'PEAK')?.ratePerKwh ||
      plan.defaultRatePerKwh;
    const offPeakRate =
      timeBasedRates.find((r) => r.rateType === 'OFF_PEAK')?.ratePerKwh ||
      plan.defaultRatePerKwh;
    const shoulderRate = timeBasedRates.find(
      (r) => r.rateType === 'SHOULDER',
    )?.ratePerKwh;

    const peakHours =
      timeBasedRates.find((r) => r.rateType === 'PEAK')?.startTime +
        '-' +
        timeBasedRates.find((r) => r.rateType === 'PEAK')?.endTime ||
      '06:00-22:00';
    const offPeakHours =
      timeBasedRates.find((r) => r.rateType === 'OFF_PEAK')?.startTime +
        '-' +
        timeBasedRates.find((r) => r.rateType === 'OFF_PEAK')?.endTime ||
      '22:00-06:00';
    const shoulderHours = shoulderRate
      ? timeBasedRates.find((r) => r.rateType === 'SHOULDER')?.startTime +
        '-' +
        timeBasedRates.find((r) => r.rateType === 'SHOULDER')?.endTime
      : undefined;

    // Create rate structure summary
    const rateStructureSummary = {
      totalRateBlocks: planRatesResult.rateItems.length,
      hasPeakRates: timeBasedRates.some((r) => r.rateType === 'PEAK'),
      hasOffPeakRates: timeBasedRates.some((r) => r.rateType === 'OFF_PEAK'),
      hasShoulderRates: timeBasedRates.some((r) => r.rateType === 'SHOULDER'),
      hasSeasonalRates: timeBasedRates.some((r) => r.season !== 'ALL_YEAR'),
      hasUsageBlocks: usageBlocks.length > 0,
    };

    return {
      planId: plan.planId,
      intPlanCode: plan.intPlanCode,
      extPlanCode: plan.extPlanCode,
      planName: plan.planName,
      rateStructureDescription: plan.rateStructureDescription,
      hasTimeBasedRates: plan.hasTimeBasedRates,
      defaultRatePerKwh: plan.defaultRatePerKwh,
      defaultSupplyChargePerDay: plan.defaultSupplyChargePerDay,
      timeBasedRates,
      usageBlocks,
      peakOffPeakRates: {
        peakRate,
        offPeakRate,
        shoulderRate,
        peakHours,
        offPeakHours,
        shoulderHours,
      },
      rateStructureSummary,
      effectiveFrom: plan.effectiveFrom,
      effectiveTo: plan.effectiveTo,
      termsAndConditions: plan.termsAndConditions,
    };
  }

  async findMany(query: QueryPlanDto): Promise<PaginationResponse<Plan>> {
    return this.plansRepository.findMany(query);
  }

  async getPlanMapping(): Promise<PlanMapping[]> {
    return this.plansRepository.getPlanMapping();
  }

  async findOne(id: number): Promise<NullableType<Plan>> {
    return this.plansRepository.findById(id);
  }

  async findByRateCard(rateCardId: number): Promise<Plan[]> {
    return this.plansRepository.findByRateCard(rateCardId);
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = new Plan();
    Object.assign(plan, updatePlanDto);

    if (updatePlanDto.effectiveFrom) {
      plan.effectiveFrom = new Date(updatePlanDto.effectiveFrom);
    }
    if (updatePlanDto.effectiveTo) {
      plan.effectiveTo = new Date(updatePlanDto.effectiveTo);
    }
    if (updatePlanDto.reviewDate) {
      plan.reviewDate = new Date(updatePlanDto.reviewDate);
    }

    return this.plansRepository.update(id, plan);
  }

  async remove(id: number): Promise<void> {
    await this.plansRepository.permanentlyDelete(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.plansRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.plansRepository.restore(id);
  }

  // Plan status methods
  getReadyPlansCount(): Promise<number> {
    return this.plansRepository.getReadyPlansCount();
  }

  getIncompletePlansCount(): Promise<number> {
    return this.plansRepository.getIncompletePlansCount();
  }

  getExpiredPlansCount(): Promise<number> {
    return this.plansRepository.getExpiredPlansCount();
  }

  getPlanStatusCounts(): Promise<{
    ready: number;
    incomplete: number;
    expired: number;
  }> {
    return this.plansRepository.getPlanStatusCounts();
  }

  getPlanMappingStatusCounts(): Promise<{
    active: number;
    expired: number;
  }> {
    return this.plansRepository.getPlanMappingStatusCounts();
  }

  // Additional service methods for UI functionality
  getFilterOptions(): Promise<{
    tariffs: string[];
    planTypes: string[];
    customers: string[];
    states: string[];
    distributors: string[];
  }> {
    return this.plansRepository.getFilterOptions();
  }

  exportPlans(query: QueryPlanDto): Promise<Buffer> {
    return this.plansRepository.exportPlans(query);
  }

  bulkDelete(planIds: number[]): Promise<void> {
    return this.plansRepository.bulkDelete(planIds);
  }

  bulkUpdate(
    planIds: number[],
    updates: Partial<UpdatePlanDto>,
  ): Promise<{ updated: number; failed: number }> {
    return this.plansRepository.bulkUpdate(planIds, updates);
  }

  getDashboardSummary(): Promise<{
    totalPlans: number;
    readyPlans: number;
    incompletePlans: number;
    expiredPlans: number;
    expiringSoon: number;
    recentUploads: number;
  }> {
    return this.plansRepository.getDashboardSummary();
  }

  getExpiringSoon(): Promise<Plan[]> {
    return this.plansRepository.getExpiringSoon();
  }

  getRecentUploads(): Promise<Plan[]> {
    return this.plansRepository.getRecentUploads();
  }

  getSearchSuggestions(query: string, limit: number = 10): Promise<string[]> {
    return this.plansRepository.getSearchSuggestions(query, limit);
  }

  getPlanList(): Promise<
    {
      planName: string;
      planId: string;
      tariff: string;
      planType: string;
      customer: string;
      state: string;
      distributor: string;
      effectiveTill: string;
    }[]
  > {
    return this.plansRepository.getPlanList();
  }
}
