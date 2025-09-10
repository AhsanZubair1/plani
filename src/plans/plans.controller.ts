import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PlanMapping } from '@src/plans/domain/plan-mapping';
import { PlanMappingStatusCountsDto } from '@src/plans/dto/plan-mapping-status-counts.dto';
import { PaginationResponse } from '@src/utils/types/pagination-options';

import { Plan } from './domain/plan';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanListDto } from './dto/plan-list.dto';
import { PlanStatusCountsDto } from './dto/plan-status-counts.dto';
import { PlanDto } from './dto/plan.dto';
import { QueryPlanDto } from './dto/query-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';

@ApiTags('Plans')
@Controller({
  path: 'plans',
  version: '1',
})
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'Plan created successfully',
    type: PlanDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.plansService.create(createPlanDto);
  }

  @Get('rate-card/:rateCardId')
  @ApiOperation({ summary: 'Get plans by rate card ID' })
  @ApiResponse({
    status: 200,
    description: 'Plans retrieved successfully',
    type: [PlanDto],
  })
  async findByRateCard(
    @Param('rateCardId', ParseIntPipe) rateCardId: number,
  ): Promise<Plan[]> {
    return this.plansService.findByRateCard(rateCardId);
  }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get a plan by ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Plan retrieved successfully',
  //   type: PlanDto,
  // })
  // @ApiResponse({ status: 404, description: 'Plan not found' })
  // async findOne(@Param('id', ParseIntPipe) id: number): Promise<Plan | null> {
  //   return this.plansService.findOne(id);
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({
    status: 200,
    description: 'Plan updated successfully',
    type: PlanDto,
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<Plan> {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a plan permanently' })
  @ApiResponse({ status: 204, description: 'Plan deleted successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.plansService.remove(id);
  }

  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a plan' })
  @ApiResponse({ status: 204, description: 'Plan soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.plansService.softDelete(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Restore a soft deleted plan' })
  @ApiResponse({ status: 204, description: 'Plan restored successfully' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.plansService.restore(id);
  }

  @Get('status/counts')
  @ApiOperation({
    summary: 'Get plan status counts (ready, incomplete, expired)',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan status counts retrieved successfully',
    type: PlanStatusCountsDto,
  })
  async getPlanStatusCounts(): Promise<{
    ready: number;
    incomplete: number;
    expired: number;
  }> {
    return this.plansService.getPlanStatusCounts();
  }

  // NEW_API'S

  // NEW_API'S

  @Get('status/ready/count')
  @ApiOperation({ summary: 'Get count of ready plans' })
  @ApiResponse({
    status: 200,
    description: 'Ready plans count retrieved successfully',
    schema: { type: 'number', example: 1323 },
  })
  async getReadyPlansCount(): Promise<number> {
    return this.plansService.getReadyPlansCount();
  }

  @Get('status/incomplete/count')
  @ApiOperation({ summary: 'Get count of incomplete plans' })
  @ApiResponse({
    status: 200,
    description: 'Incomplete plans count retrieved successfully',
    schema: { type: 'number', example: 48 },
  })
  async getIncompletePlansCount(): Promise<number> {
    return this.plansService.getIncompletePlansCount();
  }

  @Get('status/expired/count')
  @ApiOperation({ summary: 'Get count of expired plans' })
  @ApiResponse({
    status: 200,
    description: 'Expired plans count retrieved successfully',
    schema: { type: 'number', example: 4559 },
  })
  async getExpiredPlansCount(): Promise<number> {
    return this.plansService.getExpiredPlansCount();
  }

  // Additional routes for UI functionality

  @Get('export')
  @ApiOperation({ summary: 'Export plans to CSV/Excel' })
  @ApiResponse({
    status: 200,
    description: 'Plans exported successfully',
    schema: { type: 'string', format: 'binary' },
  })
  async exportPlans(@Query() query: QueryPlanDto): Promise<Buffer> {
    return this.plansService.exportPlans(query);
  }

  @Post('bulk/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Bulk delete plans' })
  @ApiResponse({ status: 204, description: 'Plans deleted successfully' })
  async bulkDelete(@Body() body: { planIds: number[] }): Promise<void> {
    return this.plansService.bulkDelete(body.planIds);
  }

  @Post('bulk/update')
  @ApiOperation({ summary: 'Bulk update plans' })
  @ApiResponse({ status: 200, description: 'Plans updated successfully' })
  async bulkUpdate(
    @Body() body: { planIds: number[]; updates: Partial<UpdatePlanDto> },
  ): Promise<{ updated: number; failed: number }> {
    return this.plansService.bulkUpdate(body.planIds, body.updates);
  }

  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Get plans dashboard summary' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalPlans: { type: 'number' },
        readyPlans: { type: 'number' },
        incompletePlans: { type: 'number' },
        expiredPlans: { type: 'number' },
        expiringSoon: { type: 'number' },
        recentUploads: { type: 'number' },
      },
    },
  })
  async getDashboardSummary(): Promise<{
    totalPlans: number;
    readyPlans: number;
    incompletePlans: number;
    expiredPlans: number;
    expiringSoon: number;
    recentUploads: number;
  }> {
    return this.plansService.getDashboardSummary();
  }

  @Get('expiring-soon')
  @ApiOperation({ summary: 'Get plans expiring soon (within 7 days)' })
  @ApiResponse({
    status: 200,
    description: 'Expiring plans retrieved successfully',
    type: [PlanDto],
  })
  async getExpiringSoon(): Promise<Plan[]> {
    return this.plansService.getExpiringSoon();
  }

  @Get('recent-uploads')
  @ApiOperation({ summary: 'Get recently uploaded plans (last 7 days)' })
  @ApiResponse({
    status: 200,
    description: 'Recent uploads retrieved successfully',
    type: [PlanDto],
  })
  async getRecentUploads(): Promise<Plan[]> {
    return this.plansService.getRecentUploads();
  }

  @Get('search/suggestions')
  @ApiOperation({ summary: 'Get search suggestions for plan names' })
  @ApiResponse({
    status: 200,
    description: 'Search suggestions retrieved successfully',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  })
  getSearchSuggestions(
    @Query('q') query: string,
    @Query('limit') limit: number = 10,
  ): Promise<string[]> {
    return this.plansService.getSearchSuggestions(query, limit);
  }

  @Get()
  @ApiOperation({ summary: 'Get all plans with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async findMany(
    @Query() query: QueryPlanDto,
  ): Promise<PaginationResponse<Plan>> {
    return this.plansService.findMany(query);
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get plans list with related data' })
  @ApiResponse({
    status: 200,
    description: 'Plans list retrieved successfully',
    type: [PlanListDto],
  })
  getPlanList(): Promise<PlanListDto[]> {
    return this.plansService.getPlanList();
  }

  @Get('filters/options')
  @ApiOperation({ summary: 'Get filter options for plans' })
  @ApiResponse({
    status: 200,
    description: 'Filter options retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        tariffs: { type: 'array', items: { type: 'string' } },
        planTypes: { type: 'array', items: { type: 'string' } },
        customers: { type: 'array', items: { type: 'string' } },
        states: { type: 'array', items: { type: 'string' } },
        distributors: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async getFilterOptions(): Promise<{
    tariffs: string[];
    planTypes: string[];
    customers: string[];
    states: string[];
    distributors: string[];
  }> {
    return this.plansService.getFilterOptions();
  }

  @Get('mapping')
  @ApiOperation({
    summary: 'Get all plan mapping with pagination and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan mappings retrieved successfully',
    type: PlanMapping,
  })
  async getPlanMapping(): Promise<PlanMapping[]> {
    return this.plansService.getPlanMapping();
  }

  @Get('mapping/status/counts')
  @ApiOperation({
    summary: 'Get plan mapping status counts (active, expired)',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan mapping status counts retrieved successfully',
    type: PlanMappingStatusCountsDto,
  })
  async getPlanMappingStatusCounts(): Promise<{
    active: number;
    expired: number;
  }> {
    return this.plansService.getPlanMappingStatusCounts();
  }
}
