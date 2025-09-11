import { ApiProperty } from '@nestjs/swagger';

export class RateTimingDto {
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
