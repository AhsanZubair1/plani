import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';

export class CreateRateSeasonDto {
  @ApiProperty({
    type: String,
    example: 'SUMMER',
    description: 'Season code',
  })
  @IsString()
  @IsNotEmpty()
  seasonCode: string;

  @ApiProperty({
    type: String,
    example: 'Summer Season',
    description: 'Season name',
  })
  @IsString()
  @IsNotEmpty()
  seasonName: string;

  @ApiProperty({
    type: String,
    example: '2024-06-01',
    description: 'Effective from date',
  })
  @IsDateString()
  effectiveFrom: string;

  @ApiProperty({
    type: String,
    example: '2024-08-31',
    description: 'Effective to date',
  })
  @IsDateString()
  effectiveTo: string;

  @ApiProperty({
    type: Number,
    example: 1.25,
    description: 'Daily charge',
  })
  @IsNumber()
  @Min(0)
  dailyCharge: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate ID',
  })
  @IsInt()
  @Min(1)
  rateId: number;
}
