import { ApiProperty } from '@nestjs/swagger';

export class RateCategory {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate category ID',
  })
  rateCategoryId: number;

  @ApiProperty({
    type: String,
    example: 'CAT001',
    description: 'Rate category code',
  })
  rateCategoryCode: string;

  @ApiProperty({
    type: String,
    example: 'Energy Charges',
    description: 'Rate category name',
  })
  rateCategoryName: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Allow multiple seasons',
  })
  allowMultiSeasons: boolean;
}
