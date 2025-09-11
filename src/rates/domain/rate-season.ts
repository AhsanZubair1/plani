import { ApiProperty } from '@nestjs/swagger';

export class RateSeason {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate season ID',
  })
  rateSeasonId: number;

  @ApiProperty({
    type: String,
    example: 'SUMMER',
    description: 'Season code',
  })
  seasonCode: string;

  @ApiProperty({
    type: String,
    example: 'Summer Season',
    description: 'Season name',
    nullable: true,
  })
  seasonName: string | null;

  @ApiProperty({
    type: Date,
    example: '2024-06-01',
    description: 'Effective from date',
  })
  effectiveFrom: Date;

  @ApiProperty({
    type: Date,
    example: '2024-08-31',
    description: 'Effective to date',
    nullable: true,
  })
  effectiveTo: Date | null;

  @ApiProperty({
    type: Number,
    example: 1.25,
    description: 'Daily charge',
    nullable: true,
  })
  dailyCharge: number | null;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Rate ID',
  })
  rateId: number;
}
