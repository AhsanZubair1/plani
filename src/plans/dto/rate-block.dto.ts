import { ApiProperty } from '@nestjs/swagger';

export class RateBlockDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate block ID',
  })
  rateBlockId: number;

  @ApiProperty({
    type: String,
    example: 'PEAK_HOURS',
    description: 'Rate block name',
  })
  rateBlockName: string;

  @ApiProperty({
    type: String,
    example: 'Peak Hours Rate Block',
    description: 'Rate block description',
  })
  description: string;

  @ApiProperty({
    type: String,
    example: '06:00',
    description: 'Start time in HH:MM format',
  })
  startTime: string;

  @ApiProperty({
    type: String,
    example: '22:00',
    description: 'End time in HH:MM format',
  })
  endTime: string;

  @ApiProperty({
    type: [String],
    example: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    description: 'Days of week when this rate block applies',
  })
  daysOfWeek: string[];

  @ApiProperty({
    type: Number,
    example: 0.25,
    description: 'Rate per kWh in cents',
  })
  ratePerKwh: number;

  @ApiProperty({
    type: Number,
    example: 0.15,
    description: 'Supply charge per day in cents',
  })
  supplyChargePerDay: number;

  @ApiProperty({
    type: String,
    example: 'PEAK',
    description: 'Rate type (PEAK, OFF_PEAK, SHOULDER, etc.)',
  })
  rateType: string;

  @ApiProperty({
    type: String,
    example: 'SUMMER',
    description: 'Season (SUMMER, WINTER, ALL_YEAR)',
  })
  season: string;

  @ApiProperty({
    type: String,
    example: '2024-01-01',
    description: 'Effective from date',
  })
  effectiveFrom: string;

  @ApiProperty({
    type: String,
    example: '2024-12-31',
    description: 'Effective to date',
  })
  effectiveTo: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether this rate block is active',
  })
  isActive: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Plan ID this rate block belongs to',
  })
  planId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Priority order for rate block application',
  })
  priority: number;

  @ApiProperty({
    type: String,
    example: '2024-01-01T00:00:00Z',
    description: 'Created timestamp',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    example: '2024-01-01T00:00:00Z',
    description: 'Updated timestamp',
  })
  updatedAt: string;
}
