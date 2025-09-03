import { ApiProperty } from '@nestjs/swagger';

export class FuelType {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Fuel type ID',
  })
  fuelTypeId: number;

  @ApiProperty({
    type: String,
    example: 'ELEC',
    description: 'Fuel type code',
  })
  fuelTypeCode: string;

  @ApiProperty({
    type: String,
    example: 'Electricity',
    description: 'Fuel type name',
  })
  fuelTypeName: string;
}
