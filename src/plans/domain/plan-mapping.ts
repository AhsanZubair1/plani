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
  minimumChargeAmount: string; // Changed from Number to string

  @ApiProperty({
    type: [Object],
    description: 'Array of billing codes with their types',
    example: [
      { code: 'EVRMAY2025MR', type: 'PRODUCT', typeName: 'Product Code' },
      { code: 'ABCD123', type: 'OFFERING', typeName: 'Offering Code' },
    ],
  })
  billingCode: Array<{
    code: string;
    type: string;
    typeName: string;
  }>;
}
