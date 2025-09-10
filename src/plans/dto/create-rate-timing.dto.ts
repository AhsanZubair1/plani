import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateRateTimingDto {
  @ApiProperty({
    type: String,
    example: 'WEEKDAY_PEAK',
    description: 'Rate timing name',
  })
  @IsString()
  timingName: string;

  @ApiProperty({
    type: String,
    example: 'Weekday Peak Hours',
    description: 'Rate timing description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: String,
    example: '06:00',
    description: 'Start time in HH:MM format',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format',
  })
  startTime: string;

  @ApiProperty({
    type: String,
    example: '22:00',
    description: 'End time in HH:MM format',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format',
  })
  endTime: string;

  @ApiProperty({
    type: [String],
    example: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    description: 'Days of week when this timing applies',
  })
  @IsArray()
  @IsString({ each: true })
  daysOfWeek: string[];

  @ApiProperty({
    type: String,
    example: 'SUMMER',
    description: 'Season (SUMMER, WINTER, ALL_YEAR)',
  })
  @IsString()
  season: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether this timing is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
