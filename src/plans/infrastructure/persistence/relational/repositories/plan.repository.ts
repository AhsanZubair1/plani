import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { Plan } from '@src/plans/domain/plan';
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

  async getReadyPlansCount(): Promise<number> {
    const now = new Date();
    return this.plansRepository
      .createQueryBuilder('plan')
      .where('plan.effective_from <= :now', { now })
      .andWhere('plan.effective_to >= :now', { now })
      .andWhere('plan.restricted = false')
      .getCount();
  }

  async getIncompletePlansCount(): Promise<number> {
    return this.plansRepository
      .createQueryBuilder('plan')
      .where(
        "(plan.plan_name IS NULL OR plan.plan_name = '' OR plan.eligibility_criteria IS NULL OR plan.eligibility_criteria = '')",
      )
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

  private applyFilters(
    queryBuilder: SelectQueryBuilder<PlanEntity>,
    query: QueryPlanDto,
  ): void {
    // Basic filters
    if (query.intPlanCode) {
      queryBuilder.andWhere('plan.int_plan_code = :intPlanCode', {
        intPlanCode: query.intPlanCode,
      });
    }

    if (query.extPlanCode) {
      queryBuilder.andWhere('plan.ext_plan_code = :extPlanCode', {
        extPlanCode: query.extPlanCode,
      });
    }

    if (query.planName) {
      queryBuilder.andWhere('plan.plan_name ILIKE :planName', {
        planName: `%${query.planName}%`,
      });
    }

    if (query.zoneId) {
      queryBuilder.andWhere('plan.zone_id = :zoneId', { zoneId: query.zoneId });
    }

    if (query.planTypeId) {
      queryBuilder.andWhere('plan.plan_type_id = :planTypeId', {
        planTypeId: query.planTypeId,
      });
    }

    if (query.customerTypeId) {
      queryBuilder.andWhere('plan.customer_type_id = :customerTypeId', {
        customerTypeId: query.customerTypeId,
      });
    }

    if (query.distributorId) {
      queryBuilder.andWhere('plan.distributor_id = :distributorId', {
        distributorId: query.distributorId,
      });
    }

    if (query.rateCardId) {
      queryBuilder.andWhere('plan.rate_card_id = :rateCardId', {
        rateCardId: query.rateCardId,
      });
    }

    if (query.restricted !== undefined) {
      queryBuilder.andWhere('plan.restricted = :restricted', {
        restricted: query.restricted,
      });
    }

    if (query.contingent !== undefined) {
      queryBuilder.andWhere('plan.contingent = :contingent', {
        contingent: query.contingent,
      });
    }

    if (query.effectiveFrom) {
      queryBuilder.andWhere('plan.effective_from >= :effectiveFrom', {
        effectiveFrom: query.effectiveFrom,
      });
    }

    if (query.effectiveTo) {
      queryBuilder.andWhere('plan.effective_to <= :effectiveTo', {
        effectiveTo: query.effectiveTo,
      });
    }

    // Additional UI filters
    if (query.planId) {
      queryBuilder.andWhere('plan.int_plan_code ILIKE :planId', {
        planId: `%${query.planId}%`,
      });
    }

    if (query.tariff) {
      queryBuilder
        .leftJoin('rate_cards', 'rc', 'plan.rate_card_id = rc.rate_card_id')
        .leftJoin('tariff_types', 'tt', 'rc.tariff_type_id = tt.tariff_type_id')
        .andWhere('tt.tariff_type_code ILIKE :tariff', {
          tariff: `%${query.tariff}%`,
        });
    }

    if (query.planType) {
      queryBuilder
        .leftJoin('plan_types', 'pt', 'plan.plan_type_id = pt.plan_type_id')
        .andWhere('pt.plan_type_code = :planType', {
          planType: query.planType,
        });
    }

    if (query.customer) {
      queryBuilder
        .leftJoin(
          'customer_types',
          'ct',
          'plan.customer_type_id = ct.customer_type_id',
        )
        .andWhere('ct.customer_type_code = :customer', {
          customer: query.customer,
        });
    }

    if (query.state) {
      queryBuilder
        .leftJoin('zones', 'z', 'plan.zone_id = z.zone_id')
        .andWhere('z.zone_code = :state', {
          state: query.state,
        });
    }

    if (query.distributor) {
      queryBuilder
        .leftJoin('distributors', 'd', 'plan.distributor_id = d.distributor_id')
        .andWhere('d.distributor_name ILIKE :distributor', {
          distributor: `%${query.distributor}%`,
        });
    }

    if (query.effectiveDate) {
      queryBuilder.andWhere('DATE(plan.effective_from) = :effectiveDate', {
        effectiveDate: query.effectiveDate,
      });
    }

    if (query.uploadedDate) {
      queryBuilder.andWhere('DATE(plan.created_at) = :uploadedDate', {
        uploadedDate: query.uploadedDate,
      });
    }

    if (query.assignedCampaigns) {
      // This would need to join with campaigns table
      queryBuilder
        .leftJoin('plan_campaigns', 'pc', 'plan.plan_id = pc.plan_id')
        .leftJoin('campaigns', 'c', 'pc.campaign_id = c.campaign_id')
        .andWhere('c.campaign_name ILIKE :assignedCampaigns', {
          assignedCampaigns: `%${query.assignedCampaigns}%`,
        });
    }

    // Plan status filtering
    if (query.status) {
      const now = new Date();
      switch (query.status) {
        case 'ready':
          queryBuilder.andWhere(
            'plan.effective_from <= :now AND plan.effective_to >= :now AND plan.restricted = false',
            {
              now,
            },
          );
          break;
        case 'incomplete':
          queryBuilder.andWhere(
            "(plan.plan_name IS NULL OR plan.plan_name = '' OR plan.eligibility_criteria IS NULL OR plan.eligibility_criteria = '')",
            {},
          );
          break;
        case 'expired':
          queryBuilder.andWhere('plan.effective_to < :now', { now });
          break;
      }
    }

    // Global search
    if (query.search) {
      queryBuilder.andWhere(
        '(plan.plan_name ILIKE :search OR plan.int_plan_code ILIKE :search OR plan.ext_plan_code ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<PlanEntity>,
    query: QueryPlanDto,
  ): void {
    const sortBy = query.sortBy ?? 'created_at';
    const sortOrder = query.sortOrder ?? 'DESC';

    queryBuilder.orderBy(`plan.${sortBy}`, sortOrder);
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

  async getPlanList(): Promise<
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
    const plans = await this.plansRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.rateCard', 'rateCard')
      .leftJoinAndSelect('rateCard.tariffType', 'tariffType')
      .leftJoinAndSelect('plan.planType', 'planType')
      .leftJoinAndSelect('plan.zone', 'zone')
      .leftJoinAndSelect('plan.distributor', 'distributor')
      .leftJoinAndSelect('plan.customerType', 'customerType')
      .orderBy('plan.created_at', 'DESC')
      .getMany();

    return plans.map((plan) => ({
      planName: plan.plan_name || '',
      planId: plan.int_plan_code || '',
      tariff: plan.rateCard?.tariffType?.tariff_type_code || '',
      planType: plan.planType?.plan_type_name || '',
      customer: plan.customerType?.customer_type_code || '', // Now accessible
      state: plan.zone?.zone_code || '',
      distributor: plan.distributor?.distributor_name || '', // Now accessible
      effectiveTill: plan.effective_to
        ? new Date(plan.effective_to).toLocaleDateString('en-GB')
        : '',
    }));
  }
  private getPlanStatus(plan: Plan): string {
    const now = new Date();

    if (plan.effectiveTo < now) {
      return 'Expired';
    }

    if (
      plan.effectiveFrom <= now &&
      plan.effectiveTo >= now &&
      !plan.restricted
    ) {
      return 'Ready';
    }

    if (!plan.planName || !plan.eligibilityCriteria) {
      return 'Incomplete';
    }

    return 'Unknown';
  }
}
