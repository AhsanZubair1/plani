import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    type: String,
    example: 'PLAN001',
    description: 'Internal plan code',
  })
  @IsString()
  intPlanCode: string;

  @ApiProperty({
    type: String,
    example: 'EXT001',
    description: 'External plan code',
  })
  @IsString()
  extPlanCode: string;

  @ApiProperty({
    type: String,
    example: 'Residential Basic Plan',
    description: 'Plan name',
  })
  @IsString()
  planName: string;

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
    type: String,
    example: '2024-06-01',
    description: 'Review date',
  })
  @IsDateString()
  reviewDate: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether plan is restricted',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  restricted?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether plan is contingent',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  contingent?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Direct debit only',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  directDebitOnly?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'E-billing only',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ebillingOnly?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Solar customer only',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  solarCustOnly?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'EV only',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  evOnly?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Intrinsic green',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  instrinctGreen?: boolean;

  @ApiProperty({
    type: String,
    example: 'Residential customers only',
    description: 'Eligibility criteria',
  })
  @IsString()
  eligibilityCriteria: string;

  @ApiProperty({
    type: String,
    example: 'Price may vary based on market conditions',
    description: 'Price variation details',
  })
  @IsString()
  priceVariationDetails: string;

  @ApiProperty({
    type: String,
    example: 'Standard terms and conditions apply',
    description: 'Terms and conditions',
  })
  @IsString()
  termsAndConditions: string;

  @ApiProperty({
    type: String,
    example: 'Contract expires after 12 months',
    description: 'Contract expiry details',
  })
  @IsString()
  contractExpiryDetails: string;

  @ApiProperty({
    type: String,
    example: 'Fixed rates for 12 months',
    description: 'Fixed rates information',
  })
  @IsString()
  fixedRates: string;

  @ApiProperty({
    type: Number,
    example: 0.25,
    description: 'Lowest RPS (cents per kWh)',
  })
  @IsNumber()
  @Min(0)
  lowestRps: number;

  // Foreign Key References
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Zone ID',
  })
  @IsInt()
  @Min(1)
  zoneId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Plan type ID',
  })
  @IsInt()
  @Min(1)
  planTypeId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Customer type ID',
  })
  @IsInt()
  @Min(1)
  customerTypeId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Distributor ID',
  })
  @IsInt()
  @Min(1)
  distributorId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate card ID',
  })
  @IsInt()
  @Min(1)
  rateCardId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Contract term ID',
  })
  @IsInt()
  @Min(1)
  contractTermId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Bill frequency ID',
  })
  @IsInt()
  @Min(1)
  billFreqId: number;
}
