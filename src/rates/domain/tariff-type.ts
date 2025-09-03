import { ApiProperty } from '@nestjs/swagger';

export class TariffType {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Tariff type ID',
  })
  tariffTypeId: number;

  @ApiProperty({
    type: String,
    example: 'TOU',
    description: 'Tariff type code',
  })
  tariffTypeCode: string;

  @ApiProperty({
    type: String,
    example: 'Time of Use',
    description: 'Tariff type name',
  })
  tariffTypeName: string;

  @ApiProperty({
    type: String,
    example: 'Peak/Off-Peak',
    description: 'Time definition',
  })
  timeDefinition: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Fuel type ID',
  })
  fuelTypeId: number;
}
