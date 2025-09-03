import { ApiProperty } from '@nestjs/swagger';

export class Rate {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate ID',
  })
  rateId: number;

  @ApiProperty({
    type: String,
    example: 'RATE001',
    description: 'Rate code',
  })
  rateCode: string;

  @ApiProperty({
    type: String,
    example: 'Peak Rate',
    description: 'Rate name',
  })
  rateName: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate category ID',
  })
  rateCategoryId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate card ID',
  })
  rateCardId: number;
}
