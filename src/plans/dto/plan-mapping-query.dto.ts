import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export class PlanMappingQueryDto {
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
    example: 'Citipower',
    description: 'Filter by distributor name',
  })
  @IsOptional()
  @IsString()
  distributor?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Single rate',
    description: 'Filter by retail tariff name',
  })
  @IsOptional()
  @IsString()
  retailTariff?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'RES',
    description: 'Filter by customer type',
  })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1000,
    description: 'Filter by minimum lowest possible price',
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minPrice?: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 2000,
    description: 'Filter by maximum lowest possible price',
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'EVRMAY2025MR',
    description: 'Filter by billing code',
  })
  @IsOptional()
  @IsString()
  billingCode?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'PRODUCT',
    description: 'Filter by billing code type',
  })
  @IsOptional()
  @IsString()
  billingCodeType?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'DGU123',
    description:
      'Search across plan ID, distributor, retail tariff, customer, and billing codes',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
    example: 'planId',
    description:
      'Field to sort by (planId, distributor, retailTariff, customer, lowestPossiblePrice)',
    enum: [
      'planId',
      'distributor',
      'retailTariff',
      'customer',
      'lowestPossiblePrice',
    ],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'ASC',
    description: 'Sort order (ASC or DESC)',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
