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
    nullable: true,
  })
  reviewDate: Date | null;

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
  intrinsicGreen: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Intrinsic GPP',
    nullable: true,
  })
  intrinsicGpp: boolean | null;

  @ApiProperty({
    type: String,
    example: 'Residential customers only',
    description: 'Eligibility criteria',
    nullable: true,
  })
  eligibilityCriteria: string | null;

  @ApiProperty({
    type: String,
    example: 'Price may vary based on market conditions',
    description: 'Price variation details',
    nullable: true,
  })
  priceVariationDetails: string | null;

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
    nullable: true,
  })
  contractExpiryDetails: string | null;

  @ApiProperty({
    type: String,
    example: 'Fixed rates for 12 months',
    description: 'Fixed rates information',
    nullable: true,
  })
  fixedRates: string | null;

  @ApiProperty({
    type: Number,
    example: 0.25,
    description: 'Lowest RPS (cents per kWh)',
    nullable: true,
  })
  lowestRps: number | null;

  @ApiProperty({
    type: String,
    example: 'https://example.com/factsheet.pdf',
    description: 'Factsheet URL',
    nullable: true,
  })
  factsheetUrl: string | null;

  // Foreign Key References (all nullable as per entity)
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Zone ID',
    nullable: true,
  })
  zoneId: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Plan type ID',
    nullable: true,
  })
  planTypeId: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Distributor ID',
    nullable: true,
  })
  distributorId: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Customer type ID',
    nullable: true,
  })
  customerTypeId: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate card ID',
    nullable: true,
  })
  rateCardId: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Contract term ID',
    nullable: true,
  })
  contractTermId: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Retail tariff ID',
    nullable: true,
  })
  retailTariffId: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Bill frequency ID',
    nullable: true,
  })
  billFreqId: number | null;

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
