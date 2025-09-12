import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { Plan } from '@src/plans/domain/plan';
import { PlanMapping } from '@src/plans/domain/plan-mapping';
import { QueryPlanDto } from '@src/plans/dto/query-plan.dto';
import { UpdatePlanDto } from '@src/plans/dto/update-plan.dto';
import { PlanAbstractRepository } from '@src/plans/infrastructure/persistence/plan.abstract.repository';
import { PlanEntity } from '@src/plans/infrastructure/persistence/relational/entities/plan.entity';
import { PlanMapper } from '@src/plans/infrastructure/persistence/relational/mappers/plan.mapper';
import { NullableType } from '@src/utils/types/nullable.type';
import { PaginationResponse } from '@src/utils/types/pagination-options';

@Injectable()
export class PlansRelationalRepository implements PlanAbstractRepository {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly plansRepository: Repository<PlanEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(data: Plan): Promise<Plan> {
    const persistenceModel = PlanMapper.toPersistence(data);
    const newEntity = await this.plansRepository.save(
      this.plansRepository.create(persistenceModel),
    );
    return PlanMapper.toDomain(newEntity);
  }

  async findById(id: Plan['planId']): Promise<NullableType<Plan>> {
    const entity = await this.plansRepository.findOne({
      where: { plan_id: id },
    });
    return entity ? PlanMapper.toDomain(entity) : null;
  }

  async findByRateCard(rateCardId: number): Promise<Plan[]> {
    const entities = await this.plansRepository.find({
      where: { rate_card_id: rateCardId },
      order: { created_at: 'DESC' },
    });

    return entities.map((entity) => PlanMapper.toDomain(entity));
  }

  async update(id: Plan['planId'], payload: Partial<Plan>): Promise<Plan> {
    const entity = await this.plansRepository.findOne({
      where: { plan_id: id },
    });

    if (!entity) {
      throw new Error('Plan not found');
    }

    const updatedEntity = await this.plansRepository.save(
      this.plansRepository.create(
        PlanMapper.toPersistence({
          ...PlanMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PlanMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Plan['planId']): Promise<void> {
    await this.plansRepository.update(id, { restricted: true });
  }

  async restore(id: Plan['planId']): Promise<void> {
    await this.plansRepository.update(id, { restricted: false });
  }

  async permanentlyDelete(id: Plan['planId']): Promise<void> {
    await this.plansRepository.delete(id);
  }

  async bulkDelete(planIds: number[]): Promise<void> {
    await this.plansRepository.delete(planIds);
  }

  async bulkUpdate(
    planIds: number[],
    updates: Partial<UpdatePlanDto>,
  ): Promise<{ updated: number; failed: number }> {
    let updated = 0;
    let failed = 0;

    for (const planId of planIds) {
      try {
        const plan = new Plan();
        Object.assign(plan, updates);
        await this.update(planId, plan);
        updated++;
      } catch (error) {
        failed++;
      }
    }

    return { updated, failed };
  }

  async getDashboardSummary(): Promise<{
    totalPlans: number;
    readyPlans: number;
    incompletePlans: number;
    expiredPlans: number;
    expiringSoon: number;
    recentUploads: number;
  }> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      totalPlans,
      readyPlans,
      incompletePlans,
      expiredPlans,
      expiringSoon,
      recentUploads,
    ] = await Promise.all([
      this.plansRepository.count(),
      this.getReadyPlansCount(),
      this.getIncompletePlansCount(),
      this.getExpiredPlansCount(),
      this.plansRepository
        .createQueryBuilder('plan')
        .where('plan.effective_to BETWEEN :now AND :sevenDaysFromNow', {
          now,
          sevenDaysFromNow,
        })
        .getCount(),
      this.plansRepository
        .createQueryBuilder('plan')
        .where('plan.created_at >= :sevenDaysAgo', { sevenDaysAgo })
        .getCount(),
    ]);

    return {
      totalPlans,
      readyPlans,
      incompletePlans,
      expiredPlans,
      expiringSoon,
      recentUploads,
    };
  }

  async getExpiringSoon(): Promise<Plan[]> {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const entities = await this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.effective_to BETWEEN :now AND :sevenDaysFromNow', {
        now,
        sevenDaysFromNow,
      })
      .orderBy('plan.effective_to', 'ASC')
      .getMany();

    return entities.map((entity) => PlanMapper.toDomain(entity));
  }

  async getRecentUploads(): Promise<Plan[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const entities = await this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.created_at >= :sevenDaysAgo', { sevenDaysAgo })
      .orderBy('plan.created_at', 'DESC')
      .getMany();

    return entities.map((entity) => PlanMapper.toDomain(entity));
  }

  async getSearchSuggestions(
    query: string,
    limit: number = 10,
  ): Promise<string[]> {
    const entities = await this.plansRepository
      .createQueryBuilder('plan')
      .select('DISTINCT plan.plan_name', 'planName')
      .where('plan.plan_name ILIKE :query', { query: `%${query}%` })
      .limit(limit)
      .getRawMany();

    return entities.map((entity) => entity.planName).filter(Boolean);
  }

  private getPlanStatus(plan: Plan): string {
    const now = new Date();

    if (plan.effectiveTo && plan.effectiveTo < now) {
      return 'Expired';
    }

    if (
      plan.effectiveFrom <= now &&
      (!plan.effectiveTo || plan.effectiveTo >= now) &&
      !plan.restricted
    ) {
      return 'Ready';
    }

    if (!plan.planName || !plan.eligibilityCriteria) {
      return 'Incomplete';
    }

    return 'Unknown';
  }

  private getPlanStatusForList(plan: any): string {
    const now = new Date();

    // Expired = Today's date is greater than the effective_to date
    if (plan.effective_to && new Date(plan.effective_to) < now) {
      return 'Expired';
    }

    // Ready = Plan has a populated retail_tariff_id OR zone_id
    if (plan.retail_tariff_id || plan.zone_id) {
      return 'Ready';
    }

    // Incomplete/Draft = Plan table has NULL for both retail_tariff_id and zone_id
    if (!plan.retail_tariff_id && !plan.zone_id) {
      return 'Incomplete/Draft';
    }

    return 'Unknown';
  }

  async getReadyPlansCount(): Promise<number> {
    return this.plansRepository
      .createQueryBuilder('plan')
      .where('(plan.retail_tariff_id IS NOT NULL OR plan.zone_id IS NOT NULL)')
      .getCount();
  }

  async getIncompletePlansCount(): Promise<number> {
    return this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.retail_tariff_id IS NULL AND plan.zone_id IS NULL')
      .getCount();
  }

  async getExpiredPlansCount(): Promise<number> {
    const now = new Date();
    return this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.effective_to < :now', { now })
      .getCount();
  }

  async getPlanStatusCounts(): Promise<{
    ready: number;
    incomplete: number;
    expired: number;
  }> {
    const [ready, incomplete, expired] = await Promise.all([
      this.getReadyPlansCount(),
      this.getIncompletePlansCount(),
      this.getExpiredPlansCount(),
    ]);

    return { ready, incomplete, expired };
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<PlanEntity>,
    query: QueryPlanDto,
  ): void {
    const sortBy = query.sortBy ?? 'created_at';
    const sortOrder = query.sortOrder ?? 'DESC';

    // Map sort fields to actual database columns
    let orderField: string;
    switch (sortBy) {
      case 'planName':
        orderField = 'plan.plan_name';
        break;
      case 'planId':
        orderField = 'plan.ext_plan_code';
        break;
      case 'tariff':
        orderField = 'tariffType.tariff_type_code';
        break;
      case 'planType':
        orderField = 'planType.plan_type_code';
        break;
      case 'customer':
        orderField = 'customerType.customer_type_code';
        break;
      case 'state':
        orderField = 'state.state_code';
        break;
      case 'distributor':
        orderField = 'distributor.distributor_name';
        break;
      case 'effective':
        orderField = 'plan.effective_from';
        break;
      case 'uploaded':
        orderField = 'plan.created_at';
        break;
      default:
        orderField = 'plan.created_at';
    }

    queryBuilder.orderBy(orderField, sortOrder);
  }

  // Additional methods for UI functionality
  async getFilterOptions(): Promise<{
    tariffs: string[];
    planTypes: string[];
    customers: string[];
    states: string[];
    distributors: string[];
  }> {
    const [tariffs, planTypes, customers, states, distributors] =
      await Promise.all([
        // Get unique tariffs from rate_cards and tariff_types
        this.plansRepository
          .createQueryBuilder('plan')
          .leftJoin('rate_cards', 'rc', 'plan.rate_card_id = rc.rate_card_id')
          .leftJoin(
            'tariff_types',
            'tt',
            'rc.tariff_type_id = tt.tariff_type_id',
          )
          .select('DISTINCT tt.tariff_type_code', 'tariff')
          .where('tt.tariff_type_code IS NOT NULL')
          .getRawMany()
          .then((results) => results.map((r) => r.tariff)),

        // Get unique plan types
        this.plansRepository
          .createQueryBuilder('plan')
          .leftJoin('plan_types', 'pt', 'plan.plan_type_id = pt.plan_type_id')
          .select('DISTINCT pt.plan_type_code', 'planType')
          .where('pt.plan_type_code IS NOT NULL')
          .getRawMany()
          .then((results) => results.map((r) => r.planType)),

        // Get unique customer types
        this.plansRepository
          .createQueryBuilder('plan')
          .leftJoin(
            'customer_types',
            'ct',
            'plan.customer_type_id = ct.customer_type_id',
          )
          .select('DISTINCT ct.customer_type_code', 'customer')
          .where('ct.customer_type_code IS NOT NULL')
          .getRawMany()
          .then((results) => results.map((r) => r.customer)),

        // Get unique states
        this.plansRepository
          .createQueryBuilder('plan')
          .leftJoin('zones', 'z', 'plan.zone_id = z.zone_id')
          .select('DISTINCT z.zone_code', 'state')
          .where('z.zone_code IS NOT NULL')
          .getRawMany()
          .then((results) => results.map((r) => r.state)),

        // Get unique distributors
        this.plansRepository
          .createQueryBuilder('plan')
          .leftJoin(
            'distributors',
            'd',
            'plan.distributor_id = d.distributor_id',
          )
          .select('DISTINCT d.distributor_name', 'distributor')
          .where('d.distributor_name IS NOT NULL')
          .getRawMany()
          .then((results) => results.map((r) => r.distributor)),
      ]);

    return {
      tariffs: tariffs.filter(Boolean),
      planTypes: planTypes.filter(Boolean),
      customers: customers.filter(Boolean),
      states: states.filter(Boolean),
      distributors: distributors.filter(Boolean),
    };
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<any>,
    query: QueryPlanDto,
  ): void {
    // Plan name filter
    if (query.planName) {
      queryBuilder.andWhere('plan.plan_name ILIKE :planName', {
        planName: `%${query.planName}%`,
      });
    }

    // Plan ID filter (External)
    if (query.planId) {
      queryBuilder.andWhere('plan.ext_plan_code ILIKE :planId', {
        planId: `%${query.planId}%`,
      });
    }

    // Tariff filter
    if (query.tariff) {
      queryBuilder.andWhere('tariffType.tariff_type_code = :tariff', {
        tariff: query.tariff,
      });
    }

    // Plan type filter
    if (query.planType) {
      queryBuilder.andWhere('planType.plan_type_code = :planType', {
        planType: query.planType,
      });
    }

    // Customer type filter
    if (query.customer) {
      queryBuilder.andWhere('customerType.customer_type_code = :customer', {
        customer: query.customer,
      });
    }

    // State filter
    if (query.state) {
      queryBuilder.andWhere('state.state_code = :state', {
        state: query.state,
      });
    }

    // Distributor filter
    if (query.distributor) {
      queryBuilder.andWhere('distributor.distributor_name ILIKE :distributor', {
        distributor: `%${query.distributor}%`,
      });
    }

    // Effective date filter
    if (query.effectiveDate) {
      queryBuilder.andWhere(
        'plan.effective_from <= :effectiveDate AND (plan.effective_to IS NULL OR plan.effective_to >= :effectiveDate)',
        {
          effectiveDate: query.effectiveDate,
        },
      );
    }

    // Uploaded date filter
    if (query.uploadedDate) {
      queryBuilder.andWhere('DATE(plan.created_at) = :uploadedDate', {
        uploadedDate: query.uploadedDate,
      });
    }

    // Search filter (general search across specified fields only)
    if (query.search) {
      queryBuilder.andWhere(
        '(plan.plan_name ILIKE :search OR plan.ext_plan_code ILIKE :search OR tariffType.tariff_type_code ILIKE :search OR planType.plan_type_code ILIKE :search OR customerType.customer_type_code ILIKE :search OR state.state_code ILIKE :search OR distributor.distributor_name ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
  }

  async getPlanList(query: QueryPlanDto): Promise<{
    data: {
      planName: string;
      planId: string;
      tariff: string;
      planType: string;
      customer: string;
      state: string;
      distributor: string;
      effectiveTill: string;
      assignedCampaigns: { name: string; status: string }[];
      planStatus: string;
      isHighlighted: boolean;
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder = this.plansRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.rateCard', 'rateCard')
      .leftJoinAndSelect('rateCard.tariffType', 'tariffType')
      .leftJoinAndSelect('plan.planType', 'planType')
      .leftJoinAndSelect('plan.zone', 'zone')
      .leftJoinAndSelect('plan.distributor', 'distributor')
      .leftJoinAndSelect('distributor.state', 'state')
      .leftJoinAndSelect('plan.customerType', 'customerType')
      .leftJoinAndSelect('plan.campaignPlanRelns', 'campaignPlanRelns')
      .leftJoinAndSelect('campaignPlanRelns.campaign', 'campaign')
      .leftJoinAndSelect('campaign.campaignStatus', 'campaignStatus');

    // Apply filters
    this.applyFilters(queryBuilder, query);

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Apply sorting
    this.applySorting(queryBuilder, query);

    const plans = await queryBuilder.getMany();

    const data = plans.map((plan) => {
      // Get assigned campaigns as array of objects with name and status
      const assignedCampaigns =
        plan.campaignPlanRelns
          ?.map((reln) => {
            const campaign = reln.campaign;
            if (!campaign) return null;

            const status =
              campaign.campaignStatus?.campaign_status_code || 'UNKNOWN';
            const campaignName = campaign.campaign_name;

            return {
              name: campaignName,
              status: status,
            };
          })
          .filter(
            (campaign): campaign is { name: string; status: string } =>
              campaign !== null,
          ) || [];

      // Determine plan status
      const planStatus = this.getPlanStatusForList(plan);

      // Check if plan should be highlighted (effective_from in future)
      const now = new Date();
      const isHighlighted = plan.effective_from > now;

      return {
        planName: plan.plan_name || '',
        planId: plan.int_plan_code || plan.ext_plan_code,
        tariff: plan.rateCard?.tariffType?.tariff_type_code || '',
        planType: plan.planType?.plan_type_code || '',
        customer: plan.customerType?.customer_type_code || '',
        state: plan.distributor?.state?.state_code || '',
        distributor: plan.distributor?.distributor_name || '',
        effectiveTill: plan.effective_to
          ? new Date(plan.effective_to).toLocaleDateString('en-GB')
          : '',
        assignedCampaigns,
        planStatus,
        isHighlighted,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getPlanMapping(query?: any): Promise<{
    data: PlanMapping[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder = this.plansRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.distributor', 'distributor')
      .leftJoinAndSelect('plan.customerType', 'customerType')
      .leftJoinAndSelect('plan.retailTariff', 'retailTariff')
      .leftJoinAndSelect('plan.charges', 'charges')
      .leftJoinAndSelect('plan.billingCodes', 'billingCodes')
      .leftJoinAndSelect('billingCodes.billingCodeType', 'billingCodeType');

    // Apply filters
    if (query) {
      this.applyPlanMappingFilters(queryBuilder, query);
    }

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Apply sorting
    this.applyPlanMappingSorting(queryBuilder, query);

    const plans = await queryBuilder.getMany();

    const data = plans.map((plan: any) => {
      // Get all billing codes with their types
      const billingCodes =
        plan.billingCodes?.map((billingCode: any) => ({
          code: billingCode.billing_code || '',
          type: billingCode.billingCodeType?.billing_code_type || '',
          typeName: billingCode.billingCodeType?.billing_code_type_name || '',
        })) || [];

      return {
        planId: plan.int_plan_code || '',
        distributer: plan.distributor?.distributor_name || '',
        retailTariffName: plan.retailTariff?.retail_tariff_name || '',
        customerType: plan.customerType?.customer_type_code || '',
        minimumChargeAmount: plan.lowest_rps || '',
        billingCode: billingCodes, // Now an array of billing code objects
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  private applyPlanMappingFilters(queryBuilder: any, query: any): void {
    // Plan ID filter
    if (query.planId) {
      queryBuilder.andWhere('plan.int_plan_code ILIKE :planId', {
        planId: `%${query.planId}%`,
      });
    }

    // Distributor filter
    if (query.distributor) {
      queryBuilder.andWhere('distributor.distributor_name ILIKE :distributor', {
        distributor: `%${query.distributor}%`,
      });
    }

    // Retail tariff filter
    if (query.retailTariff) {
      queryBuilder.andWhere(
        'retailTariff.retail_tariff_name ILIKE :retailTariff',
        {
          retailTariff: `%${query.retailTariff}%`,
        },
      );
    }

    // Customer type filter
    if (query.customer) {
      queryBuilder.andWhere('customerType.customer_type_code ILIKE :customer', {
        customer: `%${query.customer}%`,
      });
    }

    // Price range filters
    if (query.minPrice !== undefined) {
      queryBuilder.andWhere('plan.lowest_rps >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice !== undefined) {
      queryBuilder.andWhere('plan.lowest_rps <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    // Billing code filter
    if (query.billingCode) {
      queryBuilder.andWhere('billingCodes.billing_code ILIKE :billingCode', {
        billingCode: `%${query.billingCode}%`,
      });
    }

    // Billing code type filter
    if (query.billingCodeType) {
      queryBuilder.andWhere(
        'billingCodeType.billing_code_type ILIKE :billingCodeType',
        {
          billingCodeType: `%${query.billingCodeType}%`,
        },
      );
    }

    // General search across multiple fields
    if (query.search) {
      queryBuilder.andWhere(
        '(plan.int_plan_code ILIKE :search OR distributor.distributor_name ILIKE :search OR retailTariff.retail_tariff_name ILIKE :search OR customerType.customer_type_code ILIKE :search OR billingCodes.billing_code ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
  }

  private applyPlanMappingSorting(queryBuilder: any, query: any): void {
    const sortBy = query?.sortBy || 'planId';
    const sortOrder = query?.sortOrder || 'ASC';

    // Map sort fields to actual database columns
    let orderField: string;
    switch (sortBy) {
      case 'planId':
        orderField = 'plan.int_plan_code';
        break;
      case 'distributor':
        orderField = 'distributor.distributor_name';
        break;
      case 'retailTariff':
        orderField = 'retailTariff.retail_tariff_name';
        break;
      case 'customer':
        orderField = 'customerType.customer_type_code';
        break;
      case 'lowestPossiblePrice':
        orderField = 'plan.lowest_rps';
        break;
      default:
        orderField = 'plan.int_plan_code';
    }

    queryBuilder.orderBy(orderField, sortOrder);
  }
  async getPlanMappingStatusCounts(): Promise<{
    active: number;
    expired: number;
  }> {
    const [active, expired] = await Promise.all([
      this.getReadyPlansCount(),
      this.getIncompletePlansCount(),
      this.getExpiredPlansCount(),
    ]);

    return { active, expired };
  }

  async findMany(query: QueryPlanDto): Promise<PaginationResponse<Plan>> {
    const queryBuilder = this.plansRepository.createQueryBuilder('plan');

    this.applyFilters(queryBuilder, query);
    this.applySorting(queryBuilder, query);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

    return {
      data: entities.map((entity) => PlanMapper.toDomain(entity)),
      pagination: { page, limit },
      total,
    };
  }

  async exportPlans(query: QueryPlanDto): Promise<Buffer> {
    const plans = await this.findMany(query);

    // Convert plans to CSV format
    const csvHeaders = [
      'Plan ID',
      'Plan Name',
      'Internal Code',
      'External Code',
      'Tariff',
      'Plan Type',
      'Customer',
      'State',
      'Distributor',
      'Effective From',
      'Effective To',
      'Uploaded Date',
      'Status',
      'Assigned Campaigns',
    ];

    const csvRows = plans.data.map((plan) => [
      plan.planId,
      plan.planName,
      plan.intPlanCode,
      plan.extPlanCode,
      '', // tariff - would need to join
      '', // plan type - would need to join
      '', // customer - would need to join
      '', // state - would need to join
      '', // distributor - would need to join
      plan.effectiveFrom?.toISOString().split('T')[0] || '',
      plan.effectiveTo?.toISOString().split('T')[0] || '',
      // plan.createdAt?.toISOString().split('T')[0] || '',
      this.getPlanStatus(plan),
      '', // assigned campaigns - would need to join
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    return Buffer.from(csvContent, 'utf-8');
  }
}
