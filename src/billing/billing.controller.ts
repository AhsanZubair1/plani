import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BillingService } from './billing.service';
import { BillingCode } from './domain/billing-code';

@ApiTags('Billing')
@Controller({
  path: 'billing',
  version: '1',
})
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all billing codes' })
  @ApiResponse({
    status: 200,
    description: 'Billing codes retrieved successfully',
    type: [BillingCode],
  })
  async findAll(): Promise<BillingCode[]> {
    return this.billingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a billing code by ID' })
  @ApiResponse({
    status: 200,
    description: 'Billing code retrieved successfully',
    type: BillingCode,
  })
  @ApiResponse({ status: 404, description: 'Billing code not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BillingCode | null> {
    return this.billingService.findOne(id);
  }

  @Get('plan/:planId')
  @ApiOperation({ summary: 'Get billing codes by plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Billing codes retrieved successfully',
    type: [BillingCode],
  })
  async findByPlan(
    @Param('planId', ParseIntPipe) planId: number,
  ): Promise<BillingCode[]> {
    return this.billingService.findByPlan(planId);
  }
}
