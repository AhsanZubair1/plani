import { Injectable } from '@nestjs/common';

import { PlanMapping } from '@src/plans/domain/plan-mapping';
import { NullableType } from '@src/utils/types/nullable.type';
import { PaginationResponse } from '@src/utils/types/pagination-options';

import { Plan } from './domain/plan';
import { CreatePlanDto } from './dto/create-plan.dto';
import { QueryPlanDto } from './dto/query-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanAbstractRepository } from './infrastructure/persistence/plan.abstract.repository';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlanAbstractRepository) {}

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
    plan.instrinctGreen = createPlanDto.instrinctGreen ?? false;

    return this.plansRepository.create(plan);
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
}
