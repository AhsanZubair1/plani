import { Plan } from '@src/plans/domain/plan';
import { PlanMapping } from '@src/plans/domain/plan-mapping';
import { QueryPlanDto } from '@src/plans/dto/query-plan.dto';
import { UpdatePlanDto } from '@src/plans/dto/update-plan.dto';
import { NullableType } from '@src/utils/types/nullable.type';
import { PaginationResponse } from '@src/utils/types/pagination-options';

export abstract class PlanAbstractRepository {
  abstract create(data: Plan): Promise<Plan>;
  abstract findById(id: Plan['planId']): Promise<NullableType<Plan>>;
  abstract findMany(query: QueryPlanDto): Promise<PaginationResponse<Plan>>;
  abstract findByRateCard(rateCardId: number): Promise<Plan[]>;
  abstract update(id: Plan['planId'], payload: Partial<Plan>): Promise<Plan>;
  abstract softDelete(id: Plan['planId']): Promise<void>;
  abstract restore(id: Plan['planId']): Promise<void>;
  abstract permanentlyDelete(id: Plan['planId']): Promise<void>;

  // Plan status counts
  abstract getReadyPlansCount(): Promise<number>;
  abstract getIncompletePlansCount(): Promise<number>;
  abstract getExpiredPlansCount(): Promise<number>;
  abstract getPlanStatusCounts(): Promise<{
    ready: number;
    incomplete: number;
    expired: number;
  }>;

  // plan mapping
  abstract getPlanMappingStatusCounts(): Promise<{
    active: number;
    expired: number;
  }>;

  abstract getPlanMapping(): Promise<PlanMapping[]>;

  // Additional methods for UI functionality
  abstract getFilterOptions(): Promise<{
    tariffs: string[];
    planTypes: string[];
    customers: string[];
    states: string[];
    distributors: string[];
  }>;

  abstract exportPlans(query: QueryPlanDto): Promise<Buffer>;

  abstract bulkDelete(planIds: number[]): Promise<void>;

  abstract bulkUpdate(
    planIds: number[],
    updates: Partial<UpdatePlanDto>,
  ): Promise<{ updated: number; failed: number }>;

  abstract getDashboardSummary(): Promise<{
    totalPlans: number;
    readyPlans: number;
    incompletePlans: number;
    expiredPlans: number;
    expiringSoon: number;
    recentUploads: number;
  }>;

  abstract getExpiringSoon(): Promise<Plan[]>;

  abstract getRecentUploads(): Promise<Plan[]>;

  abstract getSearchSuggestions(
    query: string,
    limit: number,
  ): Promise<string[]>;

  // Plan list with related data
  abstract getPlanList(): Promise<
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
  >;
}
