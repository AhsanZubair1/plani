import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateTariffTypeDto {
  @ApiProperty({
    type: String,
    example: 'TOU',
    description: 'Tariff type code',
  })
  @IsString()
  @IsNotEmpty()
  tariffTypeCode: string;

  @ApiProperty({
    type: String,
    example: 'Time of Use',
    description: 'Tariff type name',
  })
  @IsString()
  @IsNotEmpty()
  tariffTypeName: string;

  @ApiProperty({
    type: String,
    example: 'Peak/Off-Peak',
    description: 'Time definition',
  })
  @IsString()
  @IsNotEmpty()
  timeDefinition: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Fuel type ID',
  })
  @IsInt()
  @Min(1)
  fuelTypeId: number;
}
