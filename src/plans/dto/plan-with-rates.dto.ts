import { ApiProperty } from '@nestjs/swagger';

export class UsageBlock {
  @ApiProperty({
    type: Number,
    example: 0,
    description: 'Minimum usage in kWh',
  })
  minUsage: number;

  @ApiProperty({
    type: Number,
    example: 1000,
    description: 'Maximum usage in kWh',
  })
  maxUsage: number;

  @ApiProperty({
    type: Number,
    example: 0.25,
    description: 'Rate per kWh in cents for this usage block',
  })
  ratePerKwh: number;

  @ApiProperty({
    type: String,
    example: 'First 1000 kWh',
    description: 'Description of this usage block',
  })
  description: string;
}

export class TimeBasedRate {
  @ApiProperty({
    type: String,
    example: 'PEAK',
    description: 'Rate type (PEAK, OFF_PEAK, SHOULDER)',
  })
  rateType: string;

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
    description: 'Days of week when this rate applies',
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
    example: 0.35,
    description: 'Rate per kWh in cents for this time period',
  })
  ratePerKwh: number;

  @ApiProperty({
    type: Number,
    example: 0.15,
    description: 'Supply charge per day in cents for this time period',
  })
  supplyChargePerDay: number;

  @ApiProperty({
    type: [UsageBlock],
    description: 'Usage blocks for this time period',
  })
  usageBlocks: UsageBlock[];
}

export class PlanWithRatesDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Plan ID',
  })
  planId: number;

  @ApiProperty({
    type: String,
    example: 'PLAN001',
    description: 'Internal plan code',
  })
  intPlanCode: string;

  @ApiProperty({
    type: String,
    example: 'EXT001',
    description: 'External plan code',
  })
  extPlanCode: string;

  @ApiProperty({
    type: String,
    example: 'Residential Basic Plan',
    description: 'Plan name',
  })
  planName: string;

  @ApiProperty({
    type: String,
    example: 'Time-of-use pricing with peak and off-peak rates',
    description: 'Rate structure description',
  })
  rateStructureDescription: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether plan has time-based rates',
  })
  hasTimeBasedRates: boolean;

  @ApiProperty({
    type: Number,
    example: 0.2,
    description: 'Default rate per kWh in cents',
  })
  defaultRatePerKwh: number;

  @ApiProperty({
    type: Number,
    example: 0.1,
    description: 'Default supply charge per day in cents',
  })
  defaultSupplyChargePerDay: number;

  @ApiProperty({
    type: [TimeBasedRate],
    description: 'Time-based rates for this plan',
  })
  timeBasedRates: TimeBasedRate[];

  @ApiProperty({
    type: [UsageBlock],
    description: 'Usage blocks for this plan',
  })
  usageBlocks: UsageBlock[];

  @ApiProperty({
    type: Object,
    description: 'Peak hours rates summary',
    example: {
      peakRate: 0.35,
      offPeakRate: 0.15,
      shoulderRate: 0.25,
      peakHours: '06:00-22:00',
      offPeakHours: '22:00-06:00',
    },
  })
  peakOffPeakRates: {
    peakRate: number;
    offPeakRate: number;
    shoulderRate?: number;
    peakHours: string;
    offPeakHours: string;
    shoulderHours?: string;
  };

  @ApiProperty({
    type: Object,
    description: 'Rate structure summary',
    example: {
      totalRateBlocks: 3,
      hasPeakRates: true,
      hasOffPeakRates: true,
      hasShoulderRates: false,
      hasSeasonalRates: true,
      hasUsageBlocks: true,
    },
  })
  rateStructureSummary: {
    totalRateBlocks: number;
    hasPeakRates: boolean;
    hasOffPeakRates: boolean;
    hasShoulderRates: boolean;
    hasSeasonalRates: boolean;
    hasUsageBlocks: boolean;
  };

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
    nullable: true,
  })
  effectiveTo: Date | null;

  @ApiProperty({
    type: String,
    example: 'Standard terms and conditions apply',
    description: 'Terms and conditions',
  })
  termsAndConditions: string;
}
