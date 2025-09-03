import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateRateCardDto {
  @ApiProperty({
    type: String,
    example: 'Residential Rate Card',
    description: 'Rate card name',
  })
  @IsString()
  @IsNotEmpty()
  rateCardName: string;

  @ApiProperty({
    type: String,
    example: 'Standard',
    description: 'Underlying network type',
  })
  @IsString()
  @IsNotEmpty()
  underlyingNtType: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Tariff type ID',
  })
  @IsInt()
  @Min(1)
  tariffTypeId: number;
}
