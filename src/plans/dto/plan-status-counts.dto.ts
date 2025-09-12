import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PlanStatusCountsDto {
  @ApiProperty({
    type: Number,
    example: 150,
    description: 'Number of ready plans',
  })
  @Expose()
  ready: number;

  @ApiProperty({
    type: Number,
    example: 25,
    description: 'Number of incomplete plans',
  })
  @Expose()
  incomplete: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Number of expired plans',
  })
  @Expose()
  expired: number;
}
