import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateRateTypeDto {
  @ApiProperty({
    type: String,
    example: 'ENERGY',
    description: 'Rate type code',
  })
  @IsString()
  @IsNotEmpty()
  rateTypeCode: string;

  @ApiProperty({
    type: String,
    example: 'Energy Rate',
    description: 'Rate type name',
  })
  @IsString()
  @IsNotEmpty()
  rateTypeName: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Has timings',
    required: false,
  })
  @IsBoolean()
  hasTimings?: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate class ID',
  })
  @IsInt()
  @Min(1)
  rateClassId: number;
}
