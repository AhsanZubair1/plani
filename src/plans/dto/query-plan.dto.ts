import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsEnum,
} from 'class-validator';

import {
  PlanStatus,
  PlanType,
  CustomerType,
} from '@src/plans/enums/plan-status.enum';

export class QueryPlanDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'PLAN001',
    description: 'Filter by internal plan code',
  })
  @IsOptional()
  @IsString()
  intPlanCode?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'EXT001',
    description: 'Filter by external plan code',
  })
  @IsOptional()
  @IsString()
  extPlanCode?: string;

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
    type: Number,
    required: false,
    example: 1,
    description: 'Filter by zone ID',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  zoneId?: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
    description: 'Filter by plan type ID',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  planTypeId?: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
    description: 'Filter by customer type ID',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  customerTypeId?: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
    description: 'Filter by distributor ID',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  distributorId?: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
    description: 'Filter by rate card ID',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  rateCardId?: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
    description: 'Filter by restricted status',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  restricted?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: true,
    description: 'Filter by contingent status',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  contingent?: boolean;

  @ApiProperty({
    type: String,
    required: false,
    example: '2024-01-01',
    description: 'Filter by effective from date',
  })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2024-12-31',
    description: 'Filter by effective to date',
  })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

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
    example: 'created_at',
    description: 'Field to sort by',
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

  // Additional filters from UI
  @ApiProperty({
    type: String,
    required: false,
    example: 'DGU123456MR',
    description: 'Filter by plan ID',
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
    example: 'market',
    enum: PlanType,
    description: 'Filter by plan type',
  })
  @IsOptional()
  @IsEnum(PlanType)
  planType?: PlanType;

  @ApiProperty({
    type: String,
    required: false,
    example: 'res',
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
    type: String,
    required: false,
    example: 'Market Offers July 2024',
    description: 'Filter by assigned campaigns',
  })
  @IsOptional()
  @IsString()
  assignedCampaigns?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'ready',
    enum: PlanStatus,
    description: 'Filter by plan status/category',
  })
  @IsOptional()
  @IsEnum(PlanStatus)
  status?: PlanStatus;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Home Special',
    description: 'Search term for plan name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
