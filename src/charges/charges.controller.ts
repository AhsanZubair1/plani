import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ChargesService } from './charges.service';
import { Charge } from './domain/charge';

@ApiTags('Charges')
@Controller({
  path: 'charges',
  version: '1',
})
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all charges' })
  @ApiResponse({
    status: 200,
    description: 'Charges retrieved successfully',
    type: [Charge],
  })
  async findAll(): Promise<Charge[]> {
    return this.chargesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a charge by ID' })
  @ApiResponse({
    status: 200,
    description: 'Charge retrieved successfully',
    type: Charge,
  })
  @ApiResponse({ status: 404, description: 'Charge not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Charge | null> {
    return this.chargesService.findOne(id);
  }

  @Get('plan/:planId')
  @ApiOperation({ summary: 'Get charges by plan ID' })
  @ApiResponse({
    status: 200,
    description: 'Charges retrieved successfully',
    type: [Charge],
  })
  async findByPlan(
    @Param('planId', ParseIntPipe) planId: number,
  ): Promise<Charge[]> {
    return this.chargesService.findByPlan(planId);
  }
}
