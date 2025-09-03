import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateRateCategoryDto {
  @ApiProperty({
    type: String,
    example: 'CAT001',
    description: 'Rate category code',
  })
  @IsString()
  @IsNotEmpty()
  rateCategoryCode: string;

  @ApiProperty({
    type: String,
    example: 'Energy Charges',
    description: 'Rate category name',
  })
  @IsString()
  @IsNotEmpty()
  rateCategoryName: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Allow multiple seasons',
    required: false,
  })
  @IsBoolean()
  allowMultiSeasons?: boolean;
}
