import { ApiProperty } from '@nestjs/swagger';

export class RateCard {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate card ID',
  })
  rateCardId: number;

  @ApiProperty({
    type: String,
    example: 'Residential Rate Card',
    description: 'Rate card name',
  })
  rateCardName: string;

  @ApiProperty({
    type: String,
    example: 'Standard',
    description: 'Underlying network type',
    nullable: true,
  })
  underlyingNtType: string | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Tariff type ID',
  })
  tariffTypeId: number;
}
