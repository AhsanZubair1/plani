import { ApiProperty } from '@nestjs/swagger';

export class Plan {
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
    type: Date,
    example: '2024-06-01',
    description: 'Review date',
  })
  reviewDate: Date;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether plan is restricted',
  })
  restricted: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether plan is contingent',
  })
  contingent: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Direct debit only',
  })
  directDebitOnly: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'E-billing only',
  })
  ebillingOnly: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Solar customer only',
  })
  solarCustOnly: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'EV only',
  })
  evOnly: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Intrinsic green',
  })
  instrinctGreen: boolean;

  @ApiProperty({
    type: String,
    example: 'Residential customers only',
    description: 'Eligibility criteria',
  })
  eligibilityCriteria: string;

  @ApiProperty({
    type: String,
    example: 'Price may vary based on market conditions',
    description: 'Price variation details',
  })
  priceVariationDetails: string;

  @ApiProperty({
    type: String,
    example: 'Standard terms and conditions apply',
    description: 'Terms and conditions',
  })
  termsAndConditions: string;

  @ApiProperty({
    type: String,
    example: 'Contract expires after 12 months',
    description: 'Contract expiry details',
  })
  contractExpiryDetails: string;

  @ApiProperty({
    type: String,
    example: 'Fixed rates for 12 months',
    description: 'Fixed rates information',
  })
  fixedRates: string;

  @ApiProperty({
    type: Number,
    example: 0.25,
    description: 'Lowest RPS (cents per kWh)',
    nullable: true,
  })
  lowestRps: number | null;

  // Foreign Key References
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Zone ID',
  })
  zoneId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Plan type ID',
  })
  planTypeId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Customer type ID',
  })
  customerTypeId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Distributor ID',
  })
  distributorId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate card ID',
  })
  rateCardId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Contract term ID',
  })
  contractTermId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Bill frequency ID',
  })
  billFreqId: number;

  // Billing Information
  @ApiProperty({
    type: String,
    example: 'BILL001',
    description: 'Billing code',
  })
  billingCode: string;

  @ApiProperty({
    type: String,
    example: 'STANDARD',
    description: 'Billing code type',
  })
  billingCodeType: string;

  @ApiProperty({
    type: Number,
    example: 30,
    description: 'Billing cycle in days',
  })
  billingCycleDays: number;

  @ApiProperty({
    type: String,
    example: 'MONTHLY',
    description: 'Billing frequency',
  })
  billingFrequency: string;

  @ApiProperty({
    type: Number,
    example: 15,
    description: 'Due date offset in days',
  })
  dueDateOffsetDays: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether plan has time-based rates',
  })
  hasTimeBasedRates: boolean;

  @ApiProperty({
    type: String,
    example: 'Time-of-use pricing with peak and off-peak rates',
    description: 'Rate structure description',
  })
  rateStructureDescription: string;

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
