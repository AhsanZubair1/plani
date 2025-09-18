import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsArray,
  IsInt,
  Min,
  Max,
} from 'class-validator';

import { AuditAction, AuditLevel } from '../domain/audit-log';

export class AuditQueryDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'user123',
    description: 'Filter by user ID',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'plans',
    description: 'Filter by resource name',
  })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: AuditAction.CREATE,
    enum: AuditAction,
    description: 'Filter by action type',
  })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiProperty({
    type: String,
    required: false,
    example: AuditLevel.INFO,
    enum: AuditLevel,
    description: 'Filter by log level',
  })
  @IsOptional()
  @IsEnum(AuditLevel)
  level?: AuditLevel;

  @ApiProperty({
    type: String,
    required: false,
    example: '2024-01-01T00:00:00Z',
    description: 'Filter by start date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2024-12-31T23:59:59Z',
    description: 'Filter by end date',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    type: [String],
    required: false,
    example: ['authentication', 'database'],
    description: 'Filter by tags',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    type: Number,
    required: false,
    example: 100,
    minimum: 1,
    maximum: 1000,
    description: 'Number of records to return',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 100;

  @ApiProperty({
    type: Number,
    required: false,
    example: 0,
    minimum: 0,
    description: 'Number of records to skip',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
