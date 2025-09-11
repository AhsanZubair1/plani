import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PlanDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  planId: number;

  @ApiProperty({
    type: String,
    example: 'PLAN001',
  })
  @Expose()
  intPlanCode: string;

  @ApiProperty({
    type: String,
    example: 'EXT001',
  })
  @Expose()
  extPlanCode: string;

  @ApiProperty({
    type: String,
    example: 'Residential Basic Plan',
  })
  @Expose()
  planName: string;

  @ApiProperty({
    type: Date,
    example: '2024-01-01',
  })
  @Expose()
  effectiveFrom: Date;

  @ApiProperty({
    type: Date,
    example: '2024-12-31',
    nullable: true,
  })
  @Expose()
  effectiveTo: Date | null;

  @ApiProperty({
    type: Date,
    example: '2024-06-01',
  })
  @Expose()
  reviewDate: Date;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  restricted: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  contingent: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  directDebitOnly: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  ebillingOnly: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  solarCustOnly: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  evOnly: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  instrinctGreen: boolean;

  @ApiProperty({
    type: String,
    example: 'Residential customers only',
  })
  @Expose()
  eligibilityCriteria: string;

  @ApiProperty({
    type: String,
    example: 'Price may vary based on market conditions',
  })
  @Expose()
  priceVariationDetails: string;

  @ApiProperty({
    type: String,
    example: 'Standard terms and conditions apply',
  })
  @Expose()
  termsAndConditions: string;

  @ApiProperty({
    type: String,
    example: 'Contract expires after 12 months',
  })
  @Expose()
  contractExpiryDetails: string;

  @ApiProperty({
    type: String,
    example: 'Fixed rates for 12 months',
  })
  @Expose()
  fixedRates: string;

  @ApiProperty({
    type: Number,
    example: 0.25,
  })
  @Expose()
  lowestRps: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  zoneId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  planTypeId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  customerTypeId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  distributorId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  rateCardId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  contractTermId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Expose()
  billFreqId: number;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
