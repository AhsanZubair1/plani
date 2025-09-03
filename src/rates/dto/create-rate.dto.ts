import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateRateDto {
  @ApiProperty({
    type: String,
    example: 'RATE001',
    description: 'Rate code',
  })
  @IsString()
  @IsNotEmpty()
  rateCode: string;

  @ApiProperty({
    type: String,
    example: 'Peak Rate',
    description: 'Rate name',
  })
  @IsString()
  @IsNotEmpty()
  rateName: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate category ID',
  })
  @IsInt()
  @Min(1)
  rateCategoryId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate card ID',
  })
  @IsInt()
  @Min(1)
  rateCardId: number;
}
