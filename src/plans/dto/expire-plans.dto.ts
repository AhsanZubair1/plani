import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, ValidateIf } from 'class-validator';

export class ExpirePlansDto {
  @ApiProperty({
    type: [Number],
    example: [1, 2, 3],
    description: 'Array of plan IDs to expire',
  })
  @IsArray()
  planIds: number[];

  @ApiProperty({
    type: String,
    format: 'date',
    example: '2024-12-31',
    description:
      'Effective to date (optional, defaults to today if not provided)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => o.effectiveTo !== undefined)
  effectiveTo?: string;
}
