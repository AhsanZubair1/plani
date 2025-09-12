import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { Campaign } from './domain/campaign';
import { CampaignDto } from './dto/campaign.dto';
import { CampaignsService } from './campaigns.service';

@ApiTags('Campaigns')
@Controller({
  path: 'campaigns',
  version: '1',
})
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({
    status: 200,
    description: 'Campaigns retrieved successfully',
    type: [CampaignDto],
  })
  async findAll(): Promise<Campaign[]> {
    return this.campaignsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Campaign ID' })
  @ApiResponse({
    status: 200,
    description: 'Campaign retrieved successfully',
    type: CampaignDto,
  })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Campaign | null> {
    return this.campaignsService.findById(id);
  }

  @Get('plan/:planId')
  @ApiOperation({ summary: 'Get campaigns by plan ID' })
  @ApiParam({ name: 'planId', type: 'number', description: 'Plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Campaigns retrieved successfully',
    type: [CampaignDto],
  })
  async findByPlanId(
    @Param('planId', ParseIntPipe) planId: number,
  ): Promise<Campaign[]> {
    return this.campaignsService.findByPlanId(planId);
  }

  @Get('status/:statusCode')
  @ApiOperation({ summary: 'Get campaigns by status code' })
  @ApiParam({ name: 'statusCode', type: 'string', description: 'Status Code' })
  @ApiResponse({
    status: 200,
    description: 'Campaigns retrieved successfully',
    type: [CampaignDto],
  })
  async findByStatus(
    @Param('statusCode') statusCode: string,
  ): Promise<Campaign[]> {
    return this.campaignsService.getCampaignsByStatus(statusCode);
  }
}
