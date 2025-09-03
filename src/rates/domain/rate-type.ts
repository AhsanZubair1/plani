import { ApiProperty } from '@nestjs/swagger';

export class RateType {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate type ID',
  })
  rateTypeId: number;

  @ApiProperty({
    type: String,
    example: 'ENERGY',
    description: 'Rate type code',
  })
  rateTypeCode: string;

  @ApiProperty({
    type: String,
    example: 'Energy Rate',
    description: 'Rate type name',
  })
  rateTypeName: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Has timings',
  })
  hasTimings: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate class ID',
  })
  rateClassId: number;
}
