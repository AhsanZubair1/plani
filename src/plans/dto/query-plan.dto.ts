import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsEnum,
} from 'class-validator';

import { PlanType, CustomerType } from '@src/plans/enums/plan-status.enum';

export class QueryPlanDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Residential',
    description: 'Filter by plan name',
  })
  @IsOptional()
  @IsString()
  planName?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'DGU123456MR',
    description: 'Filter by external plan ID',
  })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'TOU',
    description: 'Filter by tariff type',
  })
  @IsOptional()
  @IsString()
  tariff?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: PlanType.MARKET,
    enum: PlanType,
    description: 'Filter by plan type',
  })
  @IsOptional()
  @IsEnum(PlanType)
  planType?: PlanType;

  @ApiProperty({
    type: String,
    required: false,
    example: CustomerType.BUS,
    enum: CustomerType,
    description: 'Filter by customer type',
  })
  @IsOptional()
  @IsEnum(CustomerType)
  customer?: CustomerType;

  @ApiProperty({
    type: String,
    required: false,
    example: 'VIC',
    description: 'Filter by state',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Citipower',
    description: 'Filter by distributor',
  })
  @IsOptional()
  @IsString()
  distributor?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2024-12-12',
    description: 'Filter by effective date',
  })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2024-12-01',
    description: 'Filter by uploaded date',
  })
  @IsOptional()
  @IsDateString()
  uploadedDate?: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'planName',
    description:
      'Field to sort by (planName, planId, tariff, planType, customer, state, distributor, effective, uploaded)',
    enum: [
      'planName',
      'planId',
      'tariff',
      'planType',
      'customer',
      'state',
      'distributor',
      'effective',
      'uploaded',
    ],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'DESC',
    description: 'Sort order (ASC or DESC)',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @ApiProperty({
    type: String,
    required: false,
    example: 'Home Special',
    description:
      'Search term across plan name, plan ID, tariff, plan type, customer, state, distributor',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'ready',
    enum: ['ready', 'incomplete', 'expired'],
    description: 'Filter by computed status bucket. Defaults to ready.',
  })
  @IsOptional()
  @IsString()
  status?: 'ready' | 'incomplete' | 'expired';
}
