import { ApiProperty } from '@nestjs/swagger';

export class RateBlock {
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
    type: Date,
    example: '2024-01-01',
    description: 'Effective from date',
  })
  effectiveFrom: Date;

  @ApiProperty({
    type: Date,
    example: '2024-12-31',
    description: 'Effective to date',
  })
  effectiveTo: Date;

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
    type: Date,
    example: '2024-01-01T00:00:00Z',
    description: 'Created timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T00:00:00Z',
    description: 'Updated timestamp',
  })
  updatedAt: Date;
}

export class RateTiming {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate timing ID',
  })
  rateTimingId: number;

  @ApiProperty({
    type: String,
    example: 'WEEKDAY_PEAK',
    description: 'Rate timing name',
  })
  timingName: string;

  @ApiProperty({
    type: String,
    example: 'Weekday Peak Hours',
    description: 'Rate timing description',
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
    description: 'Days of week when this timing applies',
  })
  daysOfWeek: string[];

  @ApiProperty({
    type: String,
    example: 'SUMMER',
    description: 'Season (SUMMER, WINTER, ALL_YEAR)',
  })
  season: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Plan ID this timing belongs to',
  })
  planId: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether this timing is active',
  })
  isActive: boolean;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T00:00:00Z',
    description: 'Created timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T00:00:00Z',
    description: 'Updated timestamp',
  })
  updatedAt: Date;
}
