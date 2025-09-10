import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
  IsOptional,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateRateBlockDto {
  @ApiProperty({
    type: String,
    example: 'PEAK_HOURS',
    description: 'Rate block name',
  })
  @IsString()
  rateBlockName: string;

  @ApiProperty({
    type: String,
    example: 'Peak Hours Rate Block',
    description: 'Rate block description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: String,
    example: '06:00',
    description: 'Start time in HH:MM format',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format',
  })
  startTime: string;

  @ApiProperty({
    type: String,
    example: '22:00',
    description: 'End time in HH:MM format',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format',
  })
  endTime: string;

  @ApiProperty({
    type: [String],
    example: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    description: 'Days of week when this rate block applies',
  })
  @IsArray()
  @IsString({ each: true })
  daysOfWeek: string[];

  @ApiProperty({
    type: Number,
    example: 0.25,
    description: 'Rate per kWh in cents',
  })
  @IsNumber()
  @Min(0)
  ratePerKwh: number;

  @ApiProperty({
    type: Number,
    example: 0.15,
    description: 'Supply charge per day in cents',
  })
  @IsNumber()
  @Min(0)
  supplyChargePerDay: number;

  @ApiProperty({
    type: String,
    example: 'PEAK',
    description: 'Rate type (PEAK, OFF_PEAK, SHOULDER, etc.)',
  })
  @IsString()
  rateType: string;

  @ApiProperty({
    type: String,
    example: 'SUMMER',
    description: 'Season (SUMMER, WINTER, ALL_YEAR)',
  })
  @IsString()
  season: string;

  @ApiProperty({
    type: String,
    example: '2024-01-01',
    description: 'Effective from date',
  })
  @IsDateString()
  effectiveFrom: string;

  @ApiProperty({
    type: String,
    example: '2024-12-31',
    description: 'Effective to date',
  })
  @IsDateString()
  effectiveTo: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether this rate block is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Priority order for rate block application',
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  priority: number;
}
