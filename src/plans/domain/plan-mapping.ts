import { ApiProperty } from '@nestjs/swagger';

export class PlanMapping {
  @ApiProperty({
    type: String, // Changed from Number to String
    description: 'Plan identification code',
  })
  planId: string; // Changed from number to string

  @ApiProperty({
    type: String,
    description: 'Distributor name',
  })
  distributer: string;

  @ApiProperty({
    type: String,
    description: 'Retail tariff name',
  })
  retailTariffName: string;

  @ApiProperty({
    type: String,
    description: 'Customer type code',
  })
  customerType: string;

  @ApiProperty({
    type: String, // Changed from Number to String (since you're using toFixed(2))
    description: 'Total charge amount as string with 2 decimal places',
  })
  chargeAmount: string; // Changed from Number to string

  @ApiProperty({
    type: [String], // Changed from Array to [String] and Date to String[]
    description: 'Array of billing codes',
    isArray: true,
  })
  billingCodes: string[]; // Changed from Date to string[]
}
