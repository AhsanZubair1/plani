import { ApiProperty } from '@nestjs/swagger';

export class RateClass {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate class ID',
  })
  rateClassId: number;

  @ApiProperty({
    type: String,
    example: 'CLASS001',
    description: 'Rate class code',
  })
  rateClassCode: string;

  @ApiProperty({
    type: String,
    example: 'Residential Class',
    description: 'Rate class name',
  })
  rateClassName: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Validate 24 hour timing',
  })
  validate24HourTiming: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Multiplier',
  })
  multiplier: number;
}
