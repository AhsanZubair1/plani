import { Injectable } from '@nestjs/common';
import {
  AuditCreate,
  AuditRead,
  AuditUpdate,
  AuditDelete,
  AuditBulk,
  AuditSensitive,
  ModelAudit,
} from '../decorators/model-audit.decorator';
import { AuditAction, AuditLevel } from '../domain/audit-log';

/**
 * Example service showing how to use Django-style audit decorators
 * for comprehensive model auditing and percentage calculations
 */
@Injectable()
export class ExamplePlanService {
  /**
   * Example: Create a new plan with audit logging
   */
  @AuditCreate('plans', {
    message: 'New plan created successfully',
    resourceIdPath: 'data.plan_id',
    tags: ['plans', 'create', 'energy'],
    metadata: {
      category: 'energy_plan',
      source: 'admin_panel',
    },
  })
  async createPlan(createPlanDto: any): Promise<any> {
    // Your implementation here
    const plan = {
      plan_id: 123,
      plan_name: createPlanDto.name,
      effective_from: new Date(),
      // ... other fields
    };

    return { data: plan };
  }

  /**
   * Example: Read/Get plans with audit logging
   */
  @AuditRead('plans', {
    message: 'Plans retrieved successfully',
    includeQuery: true,
    tags: ['plans', 'read', 'search'],
  })
  async getPlans(query: any): Promise<any> {
    // Your implementation here
    const plans = [
      { plan_id: 1, plan_name: 'Plan A' },
      { plan_id: 2, plan_name: 'Plan B' },
    ];

    return { data: plans, total: plans.length };
  }

  /**
   * Example: Update a plan with field-level change tracking
   */
  @AuditUpdate('plans', {
    message: 'Plan updated successfully',
    resourceIdPath: 'data.plan_id',
    trackFieldChanges: true,
    excludeFields: ['updated_at', 'last_modified'],
    includeFields: [
      'plan_name',
      'effective_from',
      'effective_to',
      'restricted',
    ],
    tags: ['plans', 'update', 'modification'],
  })
  async updatePlan(planId: number, updatePlanDto: any): Promise<any> {
    // Your implementation here
    const updatedPlan = {
      plan_id: planId,
      plan_name: updatePlanDto.name,
      effective_from: updatePlanDto.effective_from,
      effective_to: updatePlanDto.effective_to,
      restricted: updatePlanDto.restricted,
      updated_at: new Date(),
    };

    return { data: updatedPlan };
  }

  /**
   * Example: Delete a plan with audit logging
   */
  @AuditDelete('plans', {
    message: 'Plan deleted successfully',
    resourceIdPath: 'params.planId',
    tags: ['plans', 'delete', 'removal'],
  })
  async deletePlan(planId: number): Promise<any> {
    // Your implementation here
    return {
      data: {
        plan_id: planId,
        deleted: true,
        deleted_at: new Date(),
      },
    };
  }

  /**
   * Example: Bulk operations with audit logging
   */
  @AuditBulk('plans', AuditAction.CREATE, {
    message: 'Bulk plan creation completed',
    tags: ['plans', 'bulk', 'create', 'import'],
    metadataExtractor: (request, response) => ({
      bulkOperation: true,
      recordCount: request.body?.plans?.length || 0,
      source: 'bulk_import',
      importType: 'csv',
    }),
  })
  async bulkCreatePlans(plans: any[]): Promise<any> {
    // Your implementation here
    const createdPlans = plans.map((plan, index) => ({
      plan_id: 1000 + index,
      plan_name: plan.name,
      created_at: new Date(),
    }));

    return {
      data: createdPlans,
      total: createdPlans.length,
      success: true,
    };
  }

  /**
   * Example: Sensitive operations with restricted audit logging
   */
  @AuditSensitive('plans', AuditAction.UPDATE, {
    message: 'Plan pricing updated (sensitive operation)',
    resourceIdPath: 'data.plan_id',
    level: AuditLevel.WARNING,
    tags: ['plans', 'sensitive', 'pricing', 'update'],
    metadata: {
      sensitiveOperation: true,
      operationType: 'pricing_update',
    },
  })
  async updatePlanPricing(planId: number, pricingData: any): Promise<any> {
    // Your implementation here - sensitive pricing update
    const updatedPlan = {
      plan_id: planId,
      pricing_updated: true,
      updated_at: new Date(),
    };

    return { data: updatedPlan };
  }

  /**
   * Example: Custom audit configuration with advanced options
   */
  @ModelAudit({
    action: AuditAction.UPDATE,
    resource: 'plans',
    message: 'Plan status changed',
    level: AuditLevel.INFO,
    includeRequest: true,
    includeResponse: true,
    trackFieldChanges: true,
    resourceIdPath: 'data.plan_id',
    tags: ['plans', 'status', 'update'],
    excludeFields: ['updated_at'],
    includeFields: ['plan_status_id', 'restricted', 'contingent'],
    metadata: {
      operationType: 'status_change',
      previousStatus: 'active',
    },
    resourceIdExtractor: (response) => {
      // Custom resource ID extraction logic
      return response?.data?.plan_id || response?.plan_id;
    },
    metadataExtractor: (request, response) => {
      // Custom metadata extraction
      return {
        previousStatus: request.body?.previous_status,
        newStatus: response?.data?.plan_status_id,
        changeReason: request.body?.change_reason,
        approvedBy: request.user?.name,
      };
    },
  })
  async changePlanStatus(planId: number, statusData: any): Promise<any> {
    // Your implementation here
    const updatedPlan = {
      plan_id: planId,
      plan_status_id: statusData.status_id,
      restricted: statusData.restricted,
      contingent: statusData.contingent,
      updated_at: new Date(),
    };

    return { data: updatedPlan };
  }

  /**
   * Example: Campaign-related operations with audit logging
   */
  @AuditCreate('campaigns', {
    message: 'New campaign created',
    resourceIdPath: 'data.campaign_id',
    tags: ['campaigns', 'create', 'marketing'],
    metadata: {
      campaignType: 'energy_plan_promotion',
      targetAudience: 'residential_customers',
    },
  })
  async createCampaign(campaignDto: any): Promise<any> {
    // Your implementation here
    const campaign = {
      campaign_id: 456,
      campaign_name: campaignDto.name,
      campaign_code: campaignDto.code,
      effective_from: campaignDto.effective_from,
      effective_to: campaignDto.effective_to,
    };

    return { data: campaign };
  }

  /**
   * Example: Channel operations with audit logging
   */
  @AuditUpdate('channels', {
    message: 'Channel configuration updated',
    resourceIdPath: 'data.channel_id',
    trackFieldChanges: true,
    includeFields: ['active', 'channel_name', 'channel_code'],
    tags: ['channels', 'update', 'configuration'],
  })
  async updateChannel(channelId: number, channelData: any): Promise<any> {
    // Your implementation here
    const updatedChannel = {
      channel_id: channelId,
      channel_name: channelData.name,
      channel_code: channelData.code,
      active: channelData.active,
      updated_at: new Date(),
    };

    return { data: updatedChannel };
  }
}

/**
 * Example of how to use the audit analytics service to get percentages
 */
@Injectable()
export class ExampleAuditAnalyticsService {
  constructor(
    private readonly entityAuditAnalyticsService: any, // EntityAuditAnalyticsService
  ) {}

  /**
   * Get percentage statistics for plans entity
   */
  async getPlansAuditPercentages(startDate?: Date, endDate?: Date) {
    return await this.entityAuditAnalyticsService.getEntityPercentageStats(
      'plans',
      startDate,
      endDate,
    );
  }

  /**
   * Compare audit statistics between plans and campaigns
   */
  async comparePlansVsCampaigns(startDate?: Date, endDate?: Date) {
    return await this.entityAuditAnalyticsService.getEntityComparisonStats(
      'plans',
      'campaigns',
      startDate,
      endDate,
    );
  }

  /**
   * Get time-based audit statistics for plans
   */
  async getPlansTimeBasedStats(startDate: Date, endDate: Date) {
    return await this.entityAuditAnalyticsService.getTimeBasedAuditStats(
      'plans',
      startDate,
      endDate,
    );
  }

  /**
   * Get comprehensive audit statistics for all entities
   */
  async getAllEntitiesAuditStats(startDate?: Date, endDate?: Date) {
    return await this.entityAuditAnalyticsService.getAllEntitiesAuditStats(
      startDate,
      endDate,
    );
  }
}
