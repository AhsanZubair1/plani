import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateRateClassDto {
  @ApiProperty({
    type: String,
    example: 'CLASS001',
    description: 'Rate class code',
  })
  @IsString()
  @IsNotEmpty()
  rateClassCode: string;

  @ApiProperty({
    type: String,
    example: 'Residential Class',
    description: 'Rate class name',
  })
  @IsString()
  @IsNotEmpty()
  rateClassName: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Validate 24 hour timing',
    required: false,
  })
  @IsBoolean()
  validate24HourTiming?: boolean;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Multiplier',
    required: false,
  })
  @IsInt()
  @Min(1)
  multiplier?: number;
}
