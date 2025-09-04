import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class QueryPlanMappingDto {
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
  retail_tariff?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '1298',
    description: 'Filter by lowest_possible_price',
  })
  @IsOptional()
  @IsString()
  lowest_possible_price?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Home Special',
    description: 'Search term for plan name',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
}
