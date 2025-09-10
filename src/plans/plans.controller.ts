import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
<<<<<<< Updated upstream
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
=======
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
>>>>>>> Stashed changes

import { PlanMapping } from '@src/plans/domain/plan-mapping';
import { PlanMappingStatusCountsDto } from '@src/plans/dto/plan-mapping-status-counts.dto';
import { PaginationResponse } from '@src/utils/types/pagination-options';

import { Plan } from './domain/plan';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanListDto } from './dto/plan-list.dto';
import { PlanWithRatesDto } from './dto/plan-with-rates.dto';
import { PlanDto } from './dto/plan.dto';
import { QueryPlanDto } from './dto/query-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';

@ApiTags('Plans')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
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

  @Get(':id/rates')
  @ApiOperation({
    summary: 'Get plan with comprehensive rate structure',
    description:
      'Get a plan with its complete rate structure including time-based rates, usage blocks, peak/off-peak rates, and seasonal pricing',
  })
  @ApiResponse({
    status: 200,
    description: 'Plan with rates retrieved successfully',
    type: PlanWithRatesDto,
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async getPlanWithRates(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlanWithRatesDto> {
    return await this.plansService.getPlanWithRates(id);
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

  // NEW_API'S

  // NEW_API'S

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

  @Get()
  @ApiOperation({ summary: 'Get all plans with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async findMany(
    @Query() query: QueryPlanDto,
  ): Promise<PaginationResponse<Plan>> {
    return this.plansService.findMany(query);
  }

  @Get('list')
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
