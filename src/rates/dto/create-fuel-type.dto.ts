import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFuelTypeDto {
  @ApiProperty({
    type: String,
    example: 'ELEC',
    description: 'Fuel type code',
  })
  @IsString()
  @IsNotEmpty()
  fuelTypeCode: string;

  @ApiProperty({
    type: String,
    example: 'Electricity',
    description: 'Fuel type name',
  })
  @IsString()
  @IsNotEmpty()
  fuelTypeName: string;
}
